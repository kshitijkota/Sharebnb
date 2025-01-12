import { ethers } from "ethers";
import { CommitmentStorage__factory } from "@/app/lib/typechain-types";
import { verifyProof } from "@/app/lib/zkp"; // Function to verify ZKP proof

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId, proof } = req.body;

    try {
        // Step 1: Verify ZKP proof
        const isValidProof = verifyProof(userId, proof);
        if (!isValidProof) {
        return res.status(403).json({ message: "Invalid ZKP proof" });
        }

        // Step 2: Fetch user data from the `storeData` endpoint
        const apiUrl = `http://localhost:3000/api/storeData?userId=${userId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({ message: error.message });
        }

        const { data: encryptedFragments } = await response.json();

        // Step 3: Verify the commitment with the blockchain
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        const commitmentStorage = CommitmentStorage__factory.connect(contractAddress, provider);

        const onChainCommitment = await commitmentStorage.getCommitment(userId);

        const calculatedCommitment = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(encryptedFragments))
        );

        if (calculatedCommitment !== onChainCommitment) {
        return res.status(400).json({ message: "Commitment verification failed" });
        }

        // Step 4: Return the encrypted fragments to the client
        return res.status(200).json({ encryptedFragments });
    } catch (error) {
        console.error("Error in /api/retrieveDataWithZKP:", error);
        res.status(500).json({ message: "Server error" });
    }
}
