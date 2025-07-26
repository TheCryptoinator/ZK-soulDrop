# 🚀 ZK SoulDrop Deployment Guide

This guide will walk you through deploying the ZK SoulDrop dApp to the BlockDAG testnet.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** wallet with BlockDAG testnet configured
3. **BlockDAG testnet tokens** for gas fees
4. **Private key** for deployment (keep this secure!)

## 🔧 Setup BlockDAG Testnet

### 1. Add BlockDAG Testnet to MetaMask

**Network Details:**
- **Network Name**: BlockDAG Testnet
- **RPC URL**: `https://testnet-rpc.blockdag.network`
- **Chain ID**: `12345`
- **Currency Symbol**: `BDAG`
- **Block Explorer**: `https://testnet-explorer.blockdag.network`

### 2. Get Testnet Tokens

Visit the BlockDAG faucet to get testnet BDAG tokens for gas fees.

## 🛠️ Deployment Steps

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
```

**Required .env variables:**
```env
BLOCKDAG_RPC_URL=https://testnet-rpc.blockdag.network
BLOCKDAG_CHAIN_ID=12345
PRIVATE_KEY=your_private_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy to BlockDAG Testnet

```bash
npm run deploy
```

**Expected Output:**
```
Deploying contracts with the account: 0x...
Account balance: 1000000000000000000

Using placeholder verifier address: 0x0000000000000000000000000000000000000000

Deploying SoulDropNFT...
SoulDropNFT deployed to: 0x...
Group ID: 0x...
Merkle Tree Depth: 20
Base URI set to: https://ipfs.io/ipfs/QmYourMetadataCID/

=== Deployment Summary ===
Network: BlockDAG Testnet
SemaphoreVerifier: 0x0000000000000000000000000000000000000000
SoulDropNFT: 0x...
Group ID: 0x...
Deployer: 0x...

Deployment info saved to deployment-info.json
```

### 5. Update Frontend Configuration

After deployment, update the contract address in `src/App.jsx`:

```javascript
const CONTRACT_ADDRESS = '0x...'; // Your deployed contract address
```

### 6. Start Frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔍 Verification

### 1. Contract Verification

1. Copy your contract address from the deployment output
2. Visit the BlockDAG explorer: `https://testnet-explorer.blockdag.network`
3. Search for your contract address
4. Submit verification with your source code

### 2. Test the dApp

1. Connect MetaMask to BlockDAG testnet
2. Generate a Semaphore identity
3. Join the group
4. Claim your SoulDrop NFT

## 🧪 Testing

Run the test suite to verify everything works:

```bash
npm run test
```

## 📁 Project Structure

```
zk-souldrop/
├── contracts/          # Smart contracts
│   └── SoulDropNFT.sol
├── scripts/           # Deployment scripts
│   └── deploy.js
├── src/               # Frontend source
│   ├── App.jsx        # Main application
│   ├── main.jsx       # React entry point
│   └── index.css      # Styles
├── test/              # Test files
│   └── SoulDropNFT.test.js
├── hardhat.config.js  # Hardhat configuration
├── package.json       # Dependencies
└── README.md          # Documentation
```

## 🔒 Security Notes

- **Never commit your private key** to version control
- **Use environment variables** for sensitive data
- **Test thoroughly** on testnet before mainnet
- **Verify contracts** on the block explorer

## 🚨 Troubleshooting

### Common Issues

1. **"Insufficient funds"**
   - Get more BDAG tokens from the faucet

2. **"Network not found"**
   - Ensure BlockDAG testnet is added to MetaMask

3. **"Contract deployment failed"**
   - Check your private key and RPC URL
   - Ensure you have sufficient gas fees

4. **"Frontend not connecting"**
   - Verify contract address is correct
   - Check MetaMask is connected to BlockDAG testnet

### Debug Mode

Enable debug logging:
```javascript
localStorage.setItem('debug', 'true');
```

## 📞 Support

For issues and questions:
- Check the main README.md
- Review the test files for examples
- Open an issue on GitHub

---

**Happy deploying! 🎉** 