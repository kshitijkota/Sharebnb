"use client";

import React, { useState } from "react";
import axios from "axios";
import { groth16 } from "snarkjs";

export default function RetrieveData() {
    const [userId, setUserId] = useState("");
    const [encryptionKey, setEncryptionKey] = useState("");
    const [retrievedData, setRetrievedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateProof = async (userId: string): Promise<{ proof: any; publicSignals: any } | null> => {
        try {
            const input = { userId: parseInt(userId) };
            const { proof, publicSignals } = await groth16.fullProve(
                input,
                "/circuits/circuit.wasm",
                "/circuits/circuit_final.zkey"
            );
            console.log("Generated proof:", proof);
            console.log("Public signals:", publicSignals);
            return { proof, publicSignals };
        } catch (err: any) {
            console.error("Error generating proof:", err.message || err);
            throw new Error("Failed to generate zero-knowledge proof. Please check the circuit files and try again.");
        }
    };

    const verifyProof = async (proof: any, publicSignals: any): Promise<boolean> => {
        try {
            const response = await fetch("/circuits/verification_key.json");
            if (!response.ok) {
                throw new Error(`Failed to fetch verification key: ${response.status} ${response.statusText}`);
            }
            const vKey = await response.json();
            console.log("Verification key:", vKey);
            return await groth16.verify(vKey, publicSignals, proof);
        } catch (err: any) {
            console.error("Error verifying proof:", err.message || err);
            throw new Error("Verification process failed. Please ensure the verification key is correct.");
        }
    };

    const decryptData = (encryptedData: string, key: string): string => {
        try {
            const encryptedBytes = Buffer.from(encryptedData, "base64");
            let decrypted = "";
            for (let i = 0; i < encryptedBytes.length; i++) {
                decrypted += String.fromCharCode(encryptedBytes[i] ^ key.charCodeAt(i % key.length));
            }
            return decrypted;
        } catch (err: any) {
            console.error("Error decrypting data:", err.message || err);
            throw new Error("Decryption failed. Ensure the encryption key is correct.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setRetrievedData(null);
        setIsLoading(true);

        try {
            console.log("Starting submission with userId:", userId);
            if (!userId || !encryptionKey) {
                throw new Error("User ID and Encryption Key are required.");
            }

            // Generate and verify proof
            const zkpResult = await generateProof(userId);
            console.log("ZKP Result:", zkpResult);

            if (!zkpResult) {
                throw new Error("Zero-knowledge proof generation failed.");
            }

            const { proof, publicSignals } = zkpResult;
            const isValid = await verifyProof(proof, publicSignals);
            console.log("Proof verification result:", isValid);

            if (!isValid) {
                throw new Error("Proof verification failed. Invalid proof.");
            }

            // If proof is valid, fetch the encrypted data through fetchData endpoint
            // which includes blockchain commitment verification
            const response = await axios.get(`http://localhost:3000/api/fetchData?userId=${userId}`);
            console.log("API Response:", response.data);

            if (response.data.encryptedFragments) {  // Note: changed from data to encryptedFragments
                const decryptedData = decryptData(response.data.encryptedFragments, encryptionKey);
                setRetrievedData(decryptedData);
            } else {
                throw new Error("No data found for this user.");
            }
        } catch (err: any) {
            console.error("Error details:", err.response?.data || err.message || err);
            setError(err.response?.data?.error || err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Retrieve and Decrypt Data</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="userId" className="block mb-2">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        className="w-full p-2 border rounded text-black"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="encryptionKey" className="block mb-2">Encryption Key:</label>
                    <input
                        type="password"
                        id="encryptionKey"
                        className="w-full p-2 border rounded text-black"
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
                    <strong>Error:</strong> {error}
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