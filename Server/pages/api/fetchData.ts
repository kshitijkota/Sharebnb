import { ethers } from "ethers";
import { CommitmentStorage__factory } from "@/lib/typechain-types";
import db from "@/lib/db"; // Database connection
import { verifyProof } from "@/lib/zkp"; // Function to verify ZKP proof

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId, proof } = req.body;

    try {
        // Verify ZKP proof
        const isValidProof = verifyProof(userId, proof);
        if (!isValidProof) {
        return res.status(403).json({ message: "Invalid ZKP proof" });
        }

        // Retrieve data from the database
        const userData = await db.collection("user_data").findOne({ userId });
        if (!userData) {
        return res.status(404).json({ message: "Data not found" });
        }

        const { encryptedFragments, commitment: storedCommitment } = userData;

        // Verify the commitment with the blockchain
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        const commitmentStorage = CommitmentStorage__factory.connect(
        contractAddress,
        provider
        );

        const onChainCommitment = await commitmentStorage.getCommitment(userId);

        if (storedCommitment !== onChainCommitment) {
        return res.status(400).json({ message: "Commitment verification failed" });
        }

        // Send the encrypted fragments to the client
        res.status(200).json({ encryptedFragments });
    } catch (error) {
        console.error("Error in /api/retrieveDataWithZKP:", error);
        res.status(500).json({ message: "Server error" });
    }
}
