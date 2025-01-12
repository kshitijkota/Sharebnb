// filepath: /home/grass/projects/hackathon/Airbnb_for_data/blockchain-setup/hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 0
      }
    },
    localhost: {
      url: "http://127.0.0.1:3001", // Use the proxy server URL
    }
  },
  paths: {
    artifacts: "./artifacts",
  }
};

export default config;