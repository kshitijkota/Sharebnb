import { ethers } from "hardhat";

async function main() {
    try {
        // Get the signer
        const [deployer] = await ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);

        // Get the contract factory
        const CommitmentStorage = await ethers.getContractFactory("CommitmentStorage");

        console.log("Deploying CommitmentStorage contract...");

        // Deploy the contract
        const commitmentStorage = await CommitmentStorage.deploy();

        // Wait for the deployment transaction to be mined
        await commitmentStorage.waitForDeployment();

        // Log the deployed contract address
        const address = await commitmentStorage.getAddress();

        console.log("CommitmentStorage contract deployed at address:", address);
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

// Execute the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });