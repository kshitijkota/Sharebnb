"use client";

import React, { useState } from "react";
import axios from "axios";
import { groth16 } from "snarkjs";

export default function RetrieveData() {
    const [userId, setUserId] = useState("");
    const [encryptionKey, setEncryptionKey] = useState("");
    const [retrievedData, setRetrievedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to generate a ZKP proof
    const generateProof = async (userId: string): Promise<{ proof: any; publicSignals: any } | null> => {
        try {
        // Placeholder for proof generation logic
        const circuitInput = { userId: BigInt(userId).toString() }; // Example circuit input
        const wasmFilePath = "/path/to/circuit.wasm"; // Update with actual path
        const zkeyFilePath = "/path/to/circuit_final.zkey"; // Update with actual path

        const { proof, publicSignals } = await groth16.fullProve(circuitInput, wasmFilePath, zkeyFilePath);

        console.log("Proof generated:", proof);
        console.log("Public signals:", publicSignals);

        return { proof, publicSignals };
        } catch (err) {
        console.error("Error generating proof:", err);
        setError("Failed to generate proof.");
        return null;
        }
    };

    // Function to decrypt data
    const decryptData = (encryptedData: string, key: string): string => {
        try {
        // Placeholder decryption logic (replace with your decryption algorithm)
        const decrypted = atob(encryptedData); // Simulates simple Base64 decryption
        return decrypted;
        } catch (err) {
        console.error("Error decrypting data:", err);
        setError("Failed to decrypt data. Ensure the encryption key is correct.");
        return "";
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setRetrievedData(null);

        if (!userId || !encryptionKey) {
        setError("Please enter both User ID and Encryption Key.");
        return;
        }

        try {
        // Generate ZKP proof
        const zkpResult = await generateProof(userId);
        if (!zkpResult) return;

        const { proof, publicSignals } = zkpResult;

        // Fetch data from the server
        const response = await axios.post("/api/fetchData", {
            userId,
            proof,
            publicSignals,
        });

        if (response.status === 200) {
            // Decrypt the data
            const decryptedData = decryptData(response.data.encryptedFragments, encryptionKey);
            setRetrievedData(decryptedData);
        } else {
            setError(response.data.message || "Failed to fetch data.");
        }
        } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching or processing the data.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h1>Retrieve and Decrypt Data</h1>
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
            <label htmlFor="userId">User ID:</label>
            <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
            />
            </div>
            <div style={{ marginBottom: "10px" }}>
            <label htmlFor="encryptionKey">Encryption Key:</label>
            <input
                type="password"
                id="encryptionKey"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                required
            />
            </div>
            <button type="submit">Fetch and Decrypt Data</button>
        </form>

        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {retrievedData && (
            <div style={{ marginTop: "20px" }}>
            <h2>Decrypted Data:</h2>
            <p>{retrievedData}</p>
            </div>
        )}
        </div>
    );
}
