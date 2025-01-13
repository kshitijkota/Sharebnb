import { ethers } from "ethers";
import { CommitmentStorage__factory } from "@/app/lib/typechain-types";
import { verifyProof } from "@/app/lib/zkp"; // Function to verify ZKP proof
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId, proof } = req.body;

    try {
        // Step 1: Verify ZKP proof
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

    } catch (error) {
        console.error("Error in /api/retrieveDataWithZKP:", error);
        res.status(500).json({ message: "Server error" });
    }
}