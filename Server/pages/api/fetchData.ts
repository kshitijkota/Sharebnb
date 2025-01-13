import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { CommitmentStorage__factory } from "@/app/lib/typechain-types";
import { CommitmentStructOutput } from "@/app/lib/typechain-types/CommitmentStorage";
import Cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize CORS middleware
const cors = Cors({
    methods: ['GET', 'OPTIONS'],
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
});

// Helper method to wait for middleware execution
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Try each provider creation method until one works
async function createProvider() {
    try {
        // Attempt 1: Basic JsonRpcProvider
        const provider1 = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
        await provider1.getNetwork(); // Test the connection
        return provider1;
    } catch (error) {
        console.log("First provider attempt failed, trying alternative...");
        try {
            // Attempt 2: Fully specified JsonRpcProvider
            const provider2 = new ethers.JsonRpcProvider(
                "https://rpc-amoy.polygon.technology",
                {
                    chainId: 80002,
                    name: 'polygon-amoy',
                    ensAddress: null
                }
            );
            await provider2.getNetwork(); // Test the connection
            return provider2;
        } catch (error) {
            console.log("Second provider attempt failed, trying fallback...");
            // Attempt 3: Basic HTTP Provider
            const fallbackProvider = new ethers.JsonRpcProvider({
                url: "https://rpc-amoy.polygon.technology",
                skipFetchSetup: true
            });
            return fallbackProvider;
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await runMiddleware(req, res, cors);

    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowedMethods: ['GET'],
        });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                error: 'Missing required field: userId',
            });
        }

        // Step 1: Fetch user data
        try {
            const apiUrl = new URL('http://localhost:3000/api/storeData');
            apiUrl.searchParams.append('userId', userId.toString());

            const response = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return res.status(response.status).json({
                    error: 'Data fetch failed',
                    details: errorData.message,
                });
            }

            const { data: encryptedFragments } = await response.json();

            // Step 2: Verify blockchain commitment
            try {
                const provider = await createProvider();
                const contractAddress = "0xB75358cB48f472d3809c1eD36F34D4790e74042d";

                console.log("Connecting to contract at:", contractAddress);

                const commitmentStorage = CommitmentStorage__factory.connect(
                    contractAddress,
                    provider
                );

                // Add retry logic for network calls
                const getCommitments = async (retries = 3): Promise<CommitmentStructOutput[]> => {
                    try {
                        return await commitmentStorage.getCommitments(userId.toString());
                    } catch (error) {
                        console.error('GetCommitments error:', error);
                        if (retries > 0) {
                            console.log(`Retry attempt ${4 - retries} for getCommitments`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            return getCommitments(retries - 1);
                        }
                        throw error;
                    }
                };

                const onChainCommitments = await getCommitments();
                console.log("On-chain commitments:", onChainCommitments);

                const calculatedCommitment = ethers.keccak256(
                    ethers.toUtf8Bytes(JSON.stringify(encryptedFragments))
                );

                console.log("Calculated commitment:", calculatedCommitment);

                const commitmentExists = onChainCommitments.some(
                    (commitmentStruct: CommitmentStructOutput) =>
                        commitmentStruct.commitment.toLowerCase() === calculatedCommitment.toLowerCase()
                );

                if (!commitmentExists) {
                    return res.status(400).json({ error: 'Commitment verification failed' });
                }

                return res.status(200).json({ encryptedFragments });

            } catch (blockchainError) {
                console.error('Blockchain verification error:', blockchainError);
                return res.status(500).json({
                    error: 'Blockchain verification failed',
                    details: blockchainError instanceof Error ? blockchainError.message : 'Unknown error',
                });
            }

        } catch (fetchError) {
            console.error('Data fetch error:', fetchError);
            return res.status(500).json({
                error: 'Failed to fetch data',
                details: fetchError instanceof Error ? fetchError.message : 'Unknown error',
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};