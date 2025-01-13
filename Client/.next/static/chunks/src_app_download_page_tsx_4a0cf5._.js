(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_download_page_tsx_4a0cf5._.js", {

"[project]/src/app/download/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>RetrieveData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$snarkjs$2f$build$2f$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/snarkjs/build/browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
function RetrieveData() {
    _s();
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [encryptionKey, setEncryptionKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [retrievedData, setRetrievedData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const generateProof = async (userId)=>{
        try {
            const input = {
                userId: parseInt(userId)
            };
            const { proof, publicSignals } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$snarkjs$2f$build$2f$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groth16"].fullProve(input, "/circuits/circuit.wasm", "/circuits/circuit_final.zkey");
            console.log("Generated proof:", proof);
            console.log("Public signals:", publicSignals);
            return {
                proof,
                publicSignals
            };
        } catch (err) {
            console.error("Error generating proof:", err.message || err);
            throw new Error("Failed to generate zero-knowledge proof. Please check the circuit files and try again.");
        }
    };
    const verifyProof = async (proof, publicSignals)=>{
        try {
            const response = await fetch("/circuits/verification_key.json");
            if (!response.ok) {
                throw new Error(`Failed to fetch verification key: ${response.status} ${response.statusText}`);
            }
            const vKey = await response.json();
            console.log("Verification key:", vKey);
            return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$snarkjs$2f$build$2f$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groth16"].verify(vKey, publicSignals, proof);
        } catch (err) {
            console.error("Error verifying proof:", err.message || err);
            throw new Error("Verification process failed. Please ensure the verification key is correct.");
        }
    };
    const decryptData = (encryptedData, key)=>{
        try {
            const encryptedBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(encryptedData, "base64");
            let decrypted = "";
            for(let i = 0; i < encryptedBytes.length; i++){
                decrypted += String.fromCharCode(encryptedBytes[i] ^ key.charCodeAt(i % key.length));
            }
            return decrypted;
        } catch (err) {
            console.error("Error decrypting data:", err.message || err);
            throw new Error("Decryption failed. Ensure the encryption key is correct.");
        }
    };
    const handleSubmit = async (e)=>{
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
            // Get verification key
            const vkResponse = await fetch("/circuits/verification_key.json");
            const verificationKey = await vkResponse.json();
            // Prepare payload
            const payload = {
                userId,
                proof,
                publicSignals,
                verificationKey
            };
            console.log("Sending payload to API:", payload);
            // Make API request
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("http://localhost:3000/api/fetchData", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("API Response:", response.data);
            if (response.data.encryptedFragments) {
                const decryptedData = decryptData(response.data.encryptedFragments, encryptionKey);
                setRetrievedData(decryptedData);
            } else {
                throw new Error("Server did not return encrypted data fragments.");
            }
        } catch (err) {
            console.error("Error details:", err.response?.data || err.message || err);
            setError(err.response?.data?.error || err.message || "An unexpected error occurred.");
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-2xl mx-auto p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "Retrieve and Decrypt Data"
            }, void 0, false, {
                fileName: "[project]/src/app/download/page.tsx",
                lineNumber: 126,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "userId",
                                className: "block mb-2",
                                children: "User ID:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/download/page.tsx",
                                lineNumber: 129,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "userId",
                                className: "w-full p-2 border rounded text-black",
                                value: userId,
                                onChange: (e)=>setUserId(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/download/page.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/download/page.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "encryptionKey",
                                className: "block mb-2",
                                children: "Encryption Key:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/download/page.tsx",
                                lineNumber: 140,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                id: "encryptionKey",
                                className: "w-full p-2 border rounded text-black",
                                value: encryptionKey,
                                onChange: (e)=>setEncryptionKey(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/download/page.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/download/page.tsx",
                        lineNumber: 139,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400",
                        disabled: isLoading,
                        children: isLoading ? "Processing..." : "Fetch and Decrypt Data"
                    }, void 0, false, {
                        fileName: "[project]/src/app/download/page.tsx",
                        lineNumber: 150,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/download/page.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 p-4 bg-red-100 text-red-700 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Error:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/download/page.tsx",
                        lineNumber: 161,
                        columnNumber: 21
                    }, this),
                    " ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/download/page.tsx",
                lineNumber: 160,
                columnNumber: 17
            }, this),
            retrievedData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "Decrypted Data:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/download/page.tsx",
                        lineNumber: 167,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "p-4 bg-gray-100 rounded overflow-x-auto",
                        children: retrievedData
                    }, void 0, false, {
                        fileName: "[project]/src/app/download/page.tsx",
                        lineNumber: 168,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/download/page.tsx",
                lineNumber: 166,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/download/page.tsx",
        lineNumber: 125,
        columnNumber: 9
    }, this);
}
_s(RetrieveData, "uIfRZbHKtuFNja2I3rEso+bHdjo=");
_c = RetrieveData;
var _c;
__turbopack_refresh__.register(_c, "RetrieveData");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/download/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_app_download_page_tsx_4a0cf5._.js.map