require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    blockdag: {
      url: process.env.BLOCKDAG_RPC_URL || "https://rpc.primordial.bdagscan.com",
      chainId: parseInt(process.env.BLOCKDAG_CHAIN_ID) || 1043,
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length > 0 ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}; 