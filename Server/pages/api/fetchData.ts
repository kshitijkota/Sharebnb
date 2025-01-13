// pages/api/fetchData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { CommitmentStorage__factory } from "@/app/lib/typechain-types";
<<<<<<< HEAD
import { verifyProof } from "@/app/lib/zkp"; // Function to verify ZKP proof
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
=======
import { verifyProof } from "@/app/lib/zkp";
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
    methods: ['POST', 'OPTIONS'],
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both origins
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
>>>>>>> a45b5159ff74ff09914e6aeec2dea19fab5f1af1
    }

    // Log incoming request
    console.log("Request method:", req.method);
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);

    // Validate request method
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowedMethods: ['POST']
        });
    }

    try {
        const { userId, proof, publicSignals, verificationKey } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!userId) missingFields.push('userId');
        if (!proof) missingFields.push('proof');
        if (!publicSignals) missingFields.push('publicSignals');
        if (!verificationKey) missingFields.push('verificationKey');

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields,
                receivedFields: Object.keys(req.body)
            });
        }

        // Log the values we're about to verify
        console.log("Verifying proof with:", {
            userId,
            proof: JSON.stringify(proof),
            publicSignals: JSON.stringify(publicSignals),
            verificationKey: JSON.stringify(verificationKey)
        });

        // Step 1: Verify ZKP proof
<<<<<<< HEAD
        const publicSignals: string[] = []; // Replace with actual public signals
        const verificationKey: Record<string, unknown> = {}; // Replace with actual verification key
        
        const isValidProof = await verifyProof(
            userId,
            proof,
            publicSignals,
            verificationKey
        );

        if (!isValidProof) {
            return res.status(403).json({ message: "Invalid ZKP proof" });
        }

        // Step 2: Fetch user data
        const apiUrl = new URL("http://localhost:3000/api/storeData");
        apiUrl.searchParams.append("userId", userId);
        
        const response = await fetch(apiUrl.toString());
        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({ message: error.message });
        }

        const { data: encryptedFragments } = await response.json();

        // Step 3: Verify the commitment with the blockchain
        const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
        
        const commitmentStorage = CommitmentStorage__factory.connect(
            process.env.COMMITMENT_CONTRACT_ADDRESS as string,
            provider
        );
        
        const onChainCommitments = await commitmentStorage.getCommitments(userId);
        
        if (!onChainCommitments || onChainCommitments.length === 0) {
            return res.status(404).json({ message: "No commitments found for user" });
        }

        const calculatedCommitment = ethers.keccak256(
            ethers.toUtf8Bytes(JSON.stringify(encryptedFragments))
        );

        // Now using the correct property name 'commitmentHash' from the contract
        const onChainCommitmentValue = onChainCommitments[0].commitmentHash;

        if (calculatedCommitment !== onChainCommitmentValue) {
            return res.status(400).json({ message: "Commitment verification failed" });
        }

        // Step 4: Return the encrypted fragments
        return res.status(200).json({ encryptedFragments });

=======
        try {
            const isValidProof = await verifyProof(userId, proof, publicSignals, verificationKey);
            console.log("Proof verification result:", isValidProof);

            if (!isValidProof) {
                return res.status(403).json({ error: 'Invalid ZKP proof' });
            }
        } catch (verifyError) {
            console.error("Proof verification error:", verifyError);
            return res.status(500).json({
                error: 'Proof verification failed',
                details: verifyError instanceof Error ? verifyError.message : 'Unknown verification error'
            });
        }

        // Step 2: Fetch user data
        try {
            const apiUrl = new URL('http://localhost:3000/api/storeData');
            apiUrl.searchParams.append('userId', userId);

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

            // Step 3: Verify blockchain commitment
            try {
                const provider = new ethers.JsonRpcProvider("http://localhost:8545");
                const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

                console.log("Connecting to contract at:", contractAddress);

                const commitmentStorage = CommitmentStorage__factory.connect(contractAddress, provider);
                const onChainCommitments = await commitmentStorage.getCommitments(userId);

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

                // Step 4: Return encrypted fragments
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

>>>>>>> a45b5159ff74ff09914e6aeec2dea19fab5f1af1
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
<<<<<<< HEAD
}
=======
}

// Configure API route options
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
>>>>>>> a45b5159ff74ff09914e6aeec2dea19fab5f1af1
