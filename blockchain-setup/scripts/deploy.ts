import { ethers } from "hardhat";

async function main() {
    // Get the contract factory
    const CommitmentStorage = await ethers.getContractFactory("CommitmentStorage");

    console.log("Deploying CommitmentStorage...");

    // Deploy the contract
    const commitmentStorage = await CommitmentStorage.deploy();

    // Wait for the deployment to complete
    await commitmentStorage.waitForDeployment();

    // Get the deployed contract address
    const address = await commitmentStorage.getAddress();

    console.log("CommitmentStorage deployed to:", address);
}

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });