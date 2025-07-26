# 🧠 ZK SoulDrop

A full-stack decentralized application (dApp) that allows users to mint unique soulbound NFTs using zero-knowledge proofs via the Semaphore protocol. Built for the BlockDAG testnet.

## 🌟 Features

- **Zero-Knowledge Identity**: Generate unique Semaphore identities without revealing personal information
- **Soulbound NFTs**: Non-transferable NFTs that prove uniqueness
- **Privacy-Preserving**: Only proofs are submitted to the blockchain, not personal data
- **BlockDAG Integration**: Deployed on BlockDAG testnet for high performance
- **Modern UI**: Beautiful, responsive interface with real-time feedback

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts using OpenZeppelin and Semaphore
- **Frontend**: React with Vite for fast development
- **ZK Proofs**: Semaphore protocol for identity verification
- **Blockchain**: BlockDAG testnet (EVM-compatible)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- BlockDAG testnet tokens for gas fees

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd zk-souldrop
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
BLOCKDAG_RPC_URL=https://testnet-rpc.blockdag.network
BLOCKDAG_CHAIN_ID=12345
PRIVATE_KEY=your_private_key_here
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy to BlockDAG Testnet

```bash
npm run deploy
```

After deployment, update the contract addresses in `src/App.jsx`:
```javascript
const CONTRACT_ADDRESS = '0x...'; // Your deployed contract address
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### BlockDAG Testnet Setup

1. **Add Network to MetaMask**:
   - Network Name: BlockDAG Testnet
   - RPC URL: `https://testnet-rpc.blockdag.network`
   - Chain ID: `12345`
   - Currency Symbol: `BDAG`

2. **Get Testnet Tokens**:
   - Visit the BlockDAG faucet to get testnet BDAG tokens
   - These are needed for gas fees

### Contract Configuration

The main contract `SoulDropNFT.sol` includes:
- ERC721 standard with soulbound functionality
- Semaphore integration for ZK proofs
- Nullifier hash tracking to prevent double minting
- Group management for identity commitments

## 📖 Usage Guide

### Step 1: Connect Wallet
1. Click "Connect MetaMask"
2. Approve the connection in MetaMask
3. Ensure you're on BlockDAG testnet

### Step 2: Generate Identity
1. Click "Generate Identity"
2. This creates a unique Semaphore identity locally
3. Your identity commitment is displayed

### Step 3: Join Group
1. Click "Join Group"
2. Your identity commitment is added to the group
3. You're now eligible for NFT minting

### Step 4: Claim SoulDrop NFT
1. Click "Claim SoulDrop NFT"
2. A zero-knowledge proof is generated
3. The proof is verified on-chain
4. Your unique soulbound NFT is minted

## 🔒 Security Features

- **Soulbound NFTs**: Cannot be transferred or sold
- **Nullifier Tracking**: Prevents double minting
- **ZK Proofs**: Proves uniqueness without revealing identity
- **Group Membership**: Ensures only verified users can mint

## 🛠️ Development

### Project Structure
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
├── hardhat.config.js  # Hardhat configuration
├── package.json       # Dependencies
└── README.md          # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy to BlockDAG testnet
- `npm run test` - Run tests

### Testing

```bash
npm run test
```

## 🌐 Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Contract Verification

After deployment, verify your contracts on the BlockDAG explorer:
1. Copy the contract address from deployment output
2. Visit the BlockDAG explorer
3. Submit the verification with your source code

## 🔍 Troubleshooting

### Common Issues

1. **MetaMask Connection Failed**
   - Ensure MetaMask is installed
   - Check if you're on the correct network
   - Try refreshing the page

2. **Transaction Failed**
   - Check your BDAG balance for gas fees
   - Ensure you're on BlockDAG testnet
   - Verify contract addresses are correct

3. **Proof Generation Failed**
   - Check browser console for errors
   - Ensure all previous steps are completed
   - Try regenerating your identity

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Semaphore Protocol](https://semaphore.appliedzkp.org/) for ZK proof infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contracts
- [BlockDAG](https://blockdag.network/) for the testnet infrastructure

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

**Built with ❤️ for the ZK and BlockDAG communities** 