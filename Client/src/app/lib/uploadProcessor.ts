import { ethers } from "ethers";
import { splitAndEncryptData, Fragment } from "@/lib/dataProcessor";
import {
    CommitmentStorage,
    CommitmentStorage__factory
} from "@/lib/typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

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
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        
        // Get private key from environment variables
        const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("Private key not found in environment variables");
        }

        // Create wallet instance
        const wallet = new ethers.Wallet(privateKey, provider);

        // Use your deployed contract address on Polygon Amoy
        const contractAddress = "0xB75358cB48f472d3809c1eD36F34D4790e74042d"; // Replace with your deployed contract address
        const commitmentStorage = CommitmentStorage__factory.connect(contractAddress, wallet);

        // Upload the commitment hash to the blockchain with specific gas settings
        const transaction = await commitmentStorage.addCommitment(commitment, {
            gasPrice: ethers.parseUnits("50", "gwei"),
            gasLimit: 5000000
        });

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

        // Make the API call to the separate Next.js project
        const API_URL = 'http://localhost:3000';

        const response = await fetch(`${API_URL}/api/storeData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            mode: 'cors',
            credentials: 'omit'
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