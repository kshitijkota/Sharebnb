import { ethers } from "ethers";
import { splitAndEncryptData, Fragment } from "@/lib/dataProcessor";
import {
  CommitmentStorage,
  CommitmentStorage__factory
} from "@/lib/typechain-types";

export interface UploadProcessorParams {
    userId: string;
    data: string;
    encryptionKey: string;
    fragmentSize: number;
}

export interface UploadProcessorResult {
    encryptedFragments: Fragment[];
    response: any;
    transactionReceipt: ethers.ContractTransactionReceipt;
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

        // Convert fragments to commitment hash
        const commitment = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(encryptedFragments)));

        // Blockchain Interaction
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const signer = await provider.getSigner();

        const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        const commitmentStorage = CommitmentStorage__factory.connect(contractAddress, signer);

        // Upload the commitment hash to the blockchain
        const transaction = await commitmentStorage.addCommitment(commitment);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        if (!receipt) {
            throw new Error("Transaction failed");
        }

        // Prepare the payload for server POST request
        const payload = {
            userId,
            encryptedData: encryptedFragments,
        };

        // Make the API call to upload data to the server
        const response = await fetch("/api/storeData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to store data on the server");
        }

        const result = await response.json();

        return {
            encryptedFragments,
            response: result,
            transactionReceipt: receipt
        };
    } catch (error) {
        console.error("Error in processAndUploadData:", error);
        throw error;
    }
}