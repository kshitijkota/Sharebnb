"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Shield, Scissors, Key } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { splitAndEncryptData, Fragment } from "@/lib/dataProcessor";
import { processAndUploadData } from "@/lib/uploadProcessor";

export default function Home() {
  const [data, setData] = useState<string>("");
  const [fragmentSize, setFragmentSize] = useState<number>(16);
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateKey = () => {
    const key = Array(32)
      .fill(0)
      .map(() =>
        Math.random().toString(36).charAt(2) // Random character from a-z0-9
      )
      .join("");
    setEncryptionKey(key);
  };

  const downloadKey = () => {
    const element = document.createElement("a");
    const file = new Blob([encryptionKey], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "encryption_key.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!data || !encryptionKey || fragmentSize <= 0) {
        throw new Error("Invalid input data, encryption key, or fragment size.");
      }

      // Define the userId (this can be dynamic if tied to authentication)
      const userId = "user123";

      // Use the external function to process and upload data
      const { encryptedFragments, response } = await processAndUploadData({
        userId,
        data,
        encryptionKey,
        fragmentSize,
      });

      setFragments(encryptedFragments);

      console.log("Data successfully stored:", response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-100">
              <Shield className="w-6 h-6 text-primary" />
              Data Fragmentation and Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">
                  Data to Fragment
                </label>
                <Textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="Enter the data to be fragmented and encrypted..."
                  className="h-32 bg-gray-700 text-gray-100 placeholder-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-100 flex items-center gap-2">
                    <Scissors className="w-4 h-4" />
                    Fragment Size
                  </label>
                  <Input
                    type="number"
                    value={fragmentSize}
                    onChange={(e) => setFragmentSize(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full bg-gray-700 text-gray-100 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-100 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Encryption Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder="Enter or generate an encryption key"
                      required
                      className="flex-1 bg-gray-700 text-gray-100 placeholder-gray-400"
                    />
                    <Button
                      type="button"
                      onClick={generateKey}
                      className="bg-primary text-gray-100"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              {encryptionKey && (
                <Button
                  type="button"
                  onClick={downloadKey}
                  className="w-full bg-secondary text-gray-100 hover:bg-secondary-dark"
                >
                  Download Encryption Key
                </Button>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-gray-100 hover:bg-primary-dark"
                disabled={loading}
              >
                {loading ? "Processing..." : "Upload"}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className="text-gray-100">{error}</AlertDescription>
              </Alert>
            )}

            {fragments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-100 mb-4">
                  Generated Fragments
                </h3>
                <div className="bg-gray-700 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    {JSON.stringify(fragments, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
