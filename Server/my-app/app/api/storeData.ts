import type { NextApiRequest, NextApiResponse } from "next";
// import { ContractManager } from "../../lib/blockchain";
// import { generateCommitment } from "../../lib/generateCommitment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { encryptedData, encryptionKey, randomness } = req.body;
        console.log(typeof(encryptedData))
        if (!encryptedData || !encryptionKey || !randomness) {
        return res.status(400).json({ message: "Missing required fields" });
        }

    //     try {
    //     // Generate a commitment hash
    //     const commitment = generateCommitment(encryptedData, randomness).toString();

    //     // Store the commitment on the blockchain
    //     const config = {
    //         rpcUrl: process.env.POLYGON_RPC_URL || "",
    //         privateKey: process.env.PRIVATE_KEY || "",
    //         contractAddress: process.env.CONTRACT_ADDRESS || "",
    //     };
    //     const manager = new ContractManager(config);
    //     const receipt = await manager.storeCommitment(commitment);

    //     // Respond with success
    //     return res.status(200).json({ transactionReceipt: receipt });
    //     } catch (error: any) {
    //     console.error("Error storing data:", error);
    //     return res.status(500).json({ message: "Failed to store data", error });
    //     }
    // } else {
    //     res.setHeader("Allow", ["POST"]);
    //     res.status(405).end(`Method ${req.method} Not Allowed`);
    // }
}
