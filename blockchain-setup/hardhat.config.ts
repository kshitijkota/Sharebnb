import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",  // Updated to match your contract's version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    mumbai: {
      url: "https://rpc-amoy.polygon.technology/", // Use an RPC URL for Polygon Mumbai (e.g., from MaticVigil, Alchemy, or Infura)
      accounts: ["d87de29009328f4ec7b9cdbb3c9084fb0e75c2c8e04210dad8e7c1d70e7ea62c"], // Add your private key (use env variable for security)
      chainId: 80001, // Mumbai Testnet Chain ID
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: ["1464cfd85c09e9582a0ce08caa5c561f6d66a81743dc432bd6d82c77c0f684d5"],
      chainId: 43113,// Use your wallet's private key
    },
  },
};

export default config;