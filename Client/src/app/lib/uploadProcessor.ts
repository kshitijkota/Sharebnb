import { splitAndEncryptData, Fragment } from "@/lib/dataProcessor";

export interface UploadProcessorParams {
    userId: string;
    data: string;
    encryptionKey: string;
    fragmentSize: number;
}

export interface UploadProcessorResult {
    encryptedFragments: Fragment[];
    response: any;
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

        // Prepare the payload
        const payload = {
            userId,
            encryptedData: encryptedFragments,
        };

        // Make the API call to upload data
        const response = await fetch("http://localhost:3000/api/storeData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to store data");
        }

        const result = await response.json();

        return { encryptedFragments, response: result };
    } catch (error) {
        console.error("Error in processAndUploadData:", error);
        throw error;
    }
}
