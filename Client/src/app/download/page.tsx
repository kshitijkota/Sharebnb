"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { groth16 } from "snarkjs";

export default function RetrieveData() {
    const [userId, setUserId] = useState("");
    const [encryptionKey, setEncryptionKey] = useState("");
    const [retrievedData, setRetrievedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Function to generate a ZKP proof
    const generateProof = async (userId: string): Promise<{ proof: any; publicSignals: any } | null> => {
        try {
            // Create the circuit input
            const input = { userId: parseInt(userId) };

            // Generate the proof using the correct paths to the compiled files
            const { proof, publicSignals } = await groth16.fullProve(
                input,
                "/zkp/circuit.wasm",  // Note: files are served from /public
                "/zkp/circuit_final.zkey"
            );

            console.log("Proof generated successfully");
            return { proof, publicSignals };
        } catch (err) {
            console.error("Error generating proof:", err);
            throw new Error("Failed to generate zero-knowledge proof");
        }
    };

    // Function to verify the proof
    const verifyProof = async (proof: any, publicSignals: any): Promise<boolean> => {
        try {
            const response = await fetch("/zkp/verification_key.json");
            const vKey = await response.json();

            const isValid = await groth16.verify(vKey, publicSignals, proof);
            return isValid;
        } catch (err) {
            console.error("Error verifying proof:", err);
            throw new Error("Failed to verify zero-knowledge proof");
        }
    };

    // Function to decrypt data using the encryption key
    const decryptData = (encryptedData: string, key: string): string => {
        try {
            // Assuming the data is base64 encoded
            const encryptedBytes = Buffer.from(encryptedData, 'base64');
            let decrypted = "";

            // XOR decryption with key
            for (let i = 0; i < encryptedBytes.length; i++) {
                decrypted += String.fromCharCode(
                    encryptedBytes[i] ^ key.charCodeAt(i % key.length)
                );
            }

            return decrypted;
        } catch (err) {
            console.error("Error decrypting data:", err);
            throw new Error("Failed to decrypt data");
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setRetrievedData(null);
        setIsLoading(true);

        try {
            if (!userId || !encryptionKey) {
                throw new Error("Please enter both User ID and Encryption Key");
            }

            // Generate and verify the proof
            const zkpResult = await generateProof(userId);
            if (!zkpResult) {
                throw new Error("Failed to generate proof");
            }

            const { proof, publicSignals } = zkpResult;

            // Verify the proof locally
            const isValid = await verifyProof(proof, publicSignals);
            if (!isValid) {
                throw new Error("Invalid proof");
            }

            // Fetch data from the server
            const response = await axios.post("/api/fetchData", {
                userId,
                proof,
                publicSignals,
            });

            if (response.data.encryptedFragments) {
                // Decrypt the data
                const decryptedData = decryptData(
                    response.data.encryptedFragments,
                    encryptionKey
                );
                setRetrievedData(decryptedData);
            } else {
                throw new Error("No data received from server");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Retrieve and Decrypt Data</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="userId" className="block mb-2">
                        User ID:
                    </label>
                    <input
                        type="text"
                        id="userId"
                        className="w-full p-2 border rounded"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="encryptionKey" className="block mb-2">
                        Encryption Key:
                    </label>
                    <input
                        type="password"
                        id="encryptionKey"
                        className="w-full p-2 border rounded"
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Fetch and Decrypt Data"}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {retrievedData && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Decrypted Data:</h2>
                    <pre className="p-4 bg-gray-100 rounded overflow-x-auto">
                        {retrievedData}
                    </pre>
                </div>
            )}
        </div>
    );
}