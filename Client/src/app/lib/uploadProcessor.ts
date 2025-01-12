import { ethers } from "ethers";
import { splitAndEncryptData, Fragment } from "@/lib/dataProcessor";
import { CommitmentStorage__factory } from "../typechain-types"; // Ensure you import the correct typechain factory

export interface UploadProcessorParams {
    userId: string;
    data: string;
    encryptionKey: string;
    fragmentSize: number;
}

export interface UploadProcessorResult {
    encryptedFragments: Fragment[];
    response: any;
    transactionReceipt: ethers.providers.TransactionReceipt;
}

export async function processAndUploadData({
    userId,
    data,
    encryptionKey,
    fragmentSize,
}: UploadProcessorParams): Promise<UploadProcessorResult> {
    try {
        // Split and encrypt the data into fragments
        const encryptedFragments = splitAndEncryptData(data, fragmentSize, encryptionKey);

        // Prepare the payload for blockchain transaction (can include userId if required)
        const commitment = JSON.stringify(encryptedFragments);

        // Blockchain Interaction
        const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // or use Infura for live networks
        const signer = provider.getSigner(); // Ensure signer is properly connected
        const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Your contract's address
        const commitmentStorage = CommitmentStorage__factory.connect(contractAddress, signer);

        // Upload the encrypted data (commitment) to the blockchain
        const transaction = await commitmentStorage.storeCommitment(userId, commitment);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        // Prepare the payload for server POST request
        const payload = {
            userId,
            encryptedData: encryptedFragments,
        };

        // Make the API call to upload data to the server
        const response = await fetch("http://localhost:3000/api/storeData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to store data on the server");
        }

        const result = await response.json();

        // Return the encrypted fragments, server response, and transaction receipt
        return { encryptedFragments, response: result, transactionReceipt: receipt };

    } catch (error) {
        console.error("Error in processAndUploadData:", error);
        throw error;
    }
}
