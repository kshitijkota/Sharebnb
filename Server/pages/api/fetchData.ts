// pages/api/fetchData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { CommitmentStorage__factory } from "@/app/lib/typechain-types";
import Cors from "cors";

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Enable CORS
    try {
        await runMiddleware(req, res, cors);
    } catch (error) {
        console.error('CORS Error:', error);
        return res.status(500).json({
            error: 'CORS configuration error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }

    // Log incoming request
    console.log("Request method:", req.method);
    console.log("Request headers:", req.headers);
    console.log("Request query:", req.query);

    // Validate request method
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowedMethods: ['GET']
        });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                error: 'Missing required field: userId'
            });
        }

        // Step 1: Fetch user data
        try {
            const apiUrl = new URL('http://localhost:3000/api/storeData');
            apiUrl.searchParams.append('userId', userId.toString());

            console.log("Fetching data from:", apiUrl.toString());

            const response = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                return res.status(response.status).json({
                    error: 'Data fetch failed',
                    details: errorData.message
                });
            }

            const { data: encryptedFragments } = await response.json();
            console.log("Retrieved encrypted fragments");

            // Step 2: Verify blockchain commitment
            try {
                const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
                const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

                console.log("Connecting to contract at:", contractAddress);

                const commitmentStorage = CommitmentStorage__factory.connect(contractAddress, provider);
                const onChainCommitments = await commitmentStorage.getCommitments(userId.toString());

                console.log("On-chain commitments:", onChainCommitments);

                const calculatedCommitment = ethers.keccak256(
                    ethers.toUtf8Bytes(JSON.stringify(encryptedFragments))
                );

                console.log("Calculated commitment:", calculatedCommitment);

                const commitmentExists = onChainCommitments.some(
                    commitment => commitment.toString().toLowerCase() === calculatedCommitment.toLowerCase()
                );

                if (!commitmentExists) {
                    return res.status(400).json({ error: 'Commitment verification failed' });
                }

                // Step 3: Return encrypted fragments
                return res.status(200).json({ encryptedFragments });

            } catch (blockchainError) {
                console.error('Blockchain verification error:', blockchainError);
                return res.status(500).json({
                    error: 'Blockchain verification failed',
                    details: blockchainError instanceof Error ? blockchainError.message : 'Unknown error'
                });
            }

        } catch (fetchError) {
            console.error('Data fetch error:', fetchError);
            return res.status(500).json({
                error: 'Failed to fetch data',
                details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

// Configure API route options
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};