import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { CommitmentStorage__factory } from "@/app/lib/typechain-types";

if (!process.env.ETHEREUM_RPC_URL) {
    throw new Error("ETHEREUM_RPC_URL is not configured");
}

if (!process.env.COMMITMENT_CONTRACT_ADDRESS) {
    throw new Error("COMMITMENT_CONTRACT_ADDRESS is not configured");
}

const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
const COMMITMENT_CONTRACT_ADDRESS = process.env.COMMITMENT_CONTRACT_ADDRESS;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, data } = req.body;

        const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
        const commitmentStorage = CommitmentStorage__factory.connect(
            COMMITMENT_CONTRACT_ADDRESS,
            provider
        );

        // Calculate commitment hash
        const commitmentHash = ethers.keccak256(
            ethers.toUtf8Bytes(JSON.stringify(data))
        );

        // Fetch commitments
        const commitments = await commitmentStorage.getCommitments(userId);

        return res.status(200).json({ commitments, commitmentHash });
    } catch (error) {
        console.error('Ethereum proxy error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}