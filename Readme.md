# Sharebnb - Decentralized Data Storage Platform

ShareVault is a decentralized platform that allows users to securely store, share, and retrieve encrypted data, leveraging blockchain technology, Zero-Knowledge Proofs (ZKPs), and decentralized storage systems like IPFS/Filecoin. The platform ensures data privacy, integrity, and decentralization, enabling fair compensation for storage providers.

Key Features:

- **Encrypted Fragmentation**: Files are split and encrypted for secure storage.
- **Zero-Knowledge Proofs**: Proves storage integrity without exposing file content.
- **Blockchain Integration**: Metadata storage and payment systems are powered by Ethereum/Polygon.
- **Decentralized Storage**: Utilizes IPFS/Filecoin for data storage across multiple nodes.
- **Fair Compensation**: Storage providers earn cryptocurrency for hosting data.

---

## 🚀 Overview

ShareVault facilitates the sharing of encrypted data in a secure, decentralized manner. Users can upload files, which are split into encrypted fragments and stored across distributed nodes. Zero-Knowledge Proofs (ZKPs) are used to verify that data is stored correctly without revealing the contents. The platform is built with a frontend powered by React.js, Next.js, and a backend using Node.js and Ethereum/Polygon for blockchain integration.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Next.js
- **Backend**: Node.js
- **Blockchain**: Ethereum, Hardhat, Solidity Smart Contracts
- **Storage Layer**: IPFS/Filecoin
- **Zero-Knowledge Proofs**: zk-SNARKs/zk-STARKs
- **Data Encoding**: Reed-Solomon Codes

---

## 🌟 Features

- **Data Upload and Fragmentation**: Files are split into encrypted fragments using erasure coding techniques.
- **Proof of Storage**: Nodes use ZKPs to prove they store data fragments securely.
- **Decentralized Data Retrieval**: Encrypted fragments are retrieved from the network and reassembled.
- **Smart Contracts for Payments**: Storage providers are compensated via Ethereum/Polygon-based smart contracts.

---
<img width="292" alt="image" src="https://github.com/user-attachments/assets/5e6bcae3-6304-4253-940b-296de551aab2" />

## ⚙️ Setup

### Prerequisites

- **Node.js** (for the backend)
- **npm and bun** (for package management)
- **Hardhat** (for smart contract deployment)

### Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/sharevault.git
   cd sharevault
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   bun install
   ```

3. **Configure Hardhat Project**:

   - Update `hardhat.config.js` with your blockchain network details.

4. **Deploy Smart Contracts**:

   ```bash
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

5. **Start the Client**:

   ```bash
   bun run dev
   ```

6. **Start the Server**:

   ```bash
   bun run dev
   ```

7. **Run the Blockchain**:

   ```bash
   npx hardhat node
   ```

---

## 🧩 How It Works

1. **File Upload**: Users upload their files, which are split into encrypted fragments.
2. **Fragment Distribution**: The encrypted fragments are distributed across decentralized storage nodes (IPFS/Filecoin).
3. **Proof of Storage**: Storage nodes prove they store the fragments securely via Zero-Knowledge Proofs (ZKPs).
4. **Data Retrieval**: Users retrieve the encrypted fragments, which are reassembled and decrypted.
5. **Payment Mechanism**: Storage providers are compensated with cryptocurrency for their contributions.

---

## 🛡️ Security

ShareVault uses advanced security measures to protect data:

- **AES Encryption**: Encrypts data fragments to ensure only authorized users can access them.
- **Zero-Knowledge Proofs**: Validates storage integrity without revealing the actual data.
- **Smart Contracts**: Ensure tamper-proof metadata management and seamless payment processing.

---

## 📈 Future Enhancements

- **Scalability**: Incorporate advanced zk-STARKs for better performance with larger datasets.
- **Mobile Support**: Develop cross-platform mobile applications to access ShareVault on the go.
- **Real-Time Monitoring**: Add advanced monitoring features for enhanced data availability and redundancy.

---

## 📁 Project Structure

### Client-Side Code:

- **`app/`**: Contains the main application code, API routes, frontend pages, and libraries like `circom` (ZKP related files).
- **`ui/`**: Reusable UI components like buttons, alerts, and inputs.
- **`public/`**: Static files including SVGs and cryptographic files for ZKPs.

### Server-Side Code:

- **`pages/api/`**: Contains API routes for Ethereum interaction (`ethProxy.ts`), data fetching (`fetchData.ts`), and storing data (`storeData.ts`).
- **`app/`**: Server-side logic and ZKP-related libraries.

### Blockchain:

- **`contracts/`**: Solidity smart contracts for data commitment storage and locking.
- **`scripts/`**: Deployment scripts for the blockchain.

---

## 💻 Contributors

- [Kshitij Kota](https://github.com/kshitijkota)
- [Pranav Hemanth](https://github.com/Pranavh-2004)
- [Pranavjeet Naidu](https://github.com/Pranavjeet-Naidu)
- [Sampriti Saha](https://github.com/Sampriti2803)

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
