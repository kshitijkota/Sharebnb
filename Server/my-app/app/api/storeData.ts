import type { NextApiRequest, NextApiResponse } from "next";

// Temporary in-memory storage (use a database in production)
const encryptedDataStore: Record<string, any[]> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { userId, encryptedData } = req.body;

        // Validate that both `userId` and `encryptedData` are provided
        if (!userId || !encryptedData) {
        return res.status(400).json({ message: "Missing required fields: userId or encryptedData" });
        }

        try {
        // Store data for the user
        encryptedDataStore[userId] = encryptedData;

        console.log(`Data stored for user ${userId}:`, encryptedData);

        // Respond with success
        return res.status(200).json({ message: "Data successfully stored." });
        } catch (error: any) {
        console.error("Error storing data:", error);
        return res.status(500).json({
            message: "An error occurred while storing data.",
            error: error.message || error,
        });
        }
    } else if (req.method === "GET") {
        const { userId } = req.query;

        // Validate that `userId` is provided
        if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Missing or invalid userId parameter" });
        }

        try {
        // Retrieve data for the user
        const userData = encryptedDataStore[userId];

        if (!userData) {
            return res.status(404).json({ message: "No data found for the specified userId" });
        }

        // Respond with the stored data
        return res.status(200).json({ data: userData });
        } catch (error: any) {
        console.error("Error retrieving data:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving data.",
            error: error.message || error,
        });
        }
    } else {
        // Handle unsupported methods
        res.setHeader("Allow", ["POST", "GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
