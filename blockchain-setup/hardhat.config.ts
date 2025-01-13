import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",

  paths: {
    sources: "./contracts", // Default for Solidity files
    tests: "./test", // Default for tests
    cache: "./cache", // Default for cached build data
    artifacts: "./artifacts", // Default for compiled artifacts
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    mumbai: {
      url: "https://rpc-amoy.polygon.technology/", // Use an RPC URL for Polygon Mumbai (e.g., from MaticVigil, Alchemy, or Infura)
      accounts: [process.env.PRIVATE_KEY || ""], // Add your private key (use env variable for security)
      chainId: 80001, // Mumbai Testnet Chain ID
    },
  },
};

export default config;
