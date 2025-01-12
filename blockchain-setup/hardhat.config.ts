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
      url: "http://127.0.0.1:8545"
    }
  }
};

export default config;
