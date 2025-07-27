const { ethers } = require("hardhat");
const { SemaphoreVerifier } = require("@semaphore-protocol/contracts");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy SemaphoreVerifier first
  console.log("\nDeploying SemaphoreVerifier...");
  const SemaphoreVerifierFactory = await ethers.getContractFactory("SemaphoreVerifier");
  const semaphoreVerifier = await SemaphoreVerifierFactory.deploy();
  await semaphoreVerifier.waitForDeployment();
  
  console.log("SemaphoreVerifier deployed to:", semaphoreVerifier.address);

  // Deploy SoulDropNFT
  console.log("\nDeploying SoulDropNFT...");
  const SoulDropNFT = await ethers.getContractFactory("SoulDropNFT");
  
  const groupId = ethers.keccak256(ethers.toUtf8Bytes("ZK SoulDrop Group"));
  const merkleTreeDepth = 20; // Standard depth for Semaphore
  
  const soulDropNFT = await SoulDropNFT.deploy(
    "ZK SoulDrop",           // name
    "ZKSD",                  // symbol
    semaphoreVerifier,       // verifier
    groupId,                 // groupId
    merkleTreeDepth          // merkleTreeDepth
  );
  
  await soulDropNFT.waitForDeployment();
  
  console.log("SoulDropNFT deployed to:", soulDropNFT.address);
  console.log("Group ID:", groupId.toString());
  console.log("Merkle Tree Depth:", merkleTreeDepth);

  // Set base URI for metadata (optional)
  const baseURI = "https://ipfs.io/ipfs/QmYourMetadataCID/";
  await soulDropNFT.setBaseURI(baseURI);
  console.log("Base URI set to:", baseURI);

  console.log("\n=== Deployment Summary ===");
  console.log("Network: BlockDAG Testnet");
  console.log("SemaphoreVerifier:", semaphoreVerifier.address);
  console.log("SoulDropNFT:", soulDropNFT.address);
  console.log("Group ID:", groupId.toString());
  console.log("Deployer:", deployer.address);
  
  // Save deployment info to a file
  const deploymentInfo = {
    network: "BlockDAG Testnet",
    deployer: deployer.address,
    semaphoreVerifier: semaphoreVerifier.address,
    soulDropNFT: soulDropNFT.address,
    groupId: groupId.toString(),
    merkleTreeDepth: merkleTreeDepth,
    baseURI: baseURI,
    deploymentTime: new Date().toISOString()
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 