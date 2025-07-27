# 🚀 ZK SoulDrop - Deployment Guide

## 📋 **Prerequisites**

Before deploying, ensure you have:
- ✅ Node.js and npm installed
- ✅ MetaMask wallet with BlockDAG testnet configured
- ✅ BDAG testnet tokens for gas fees
- ✅ Project dependencies installed (`npm install`)

## 🔑 **Step 1: Get Your Private Key**

### **From MetaMask:**
1. Open MetaMask
2. Click the three dots (menu) → **Account details**
3. Click **Export Private Key**
4. Enter your password
5. Copy the private key (starts with `0x`)

### **⚠️ Security Warning:**
- **NEVER share your private key**
- **NEVER commit it to git**
- **Use a test wallet only** (not your main wallet)

## 🔧 **Step 2: Configure Environment**

1. **Edit the `.env` file:**
   ```bash
   # BlockDAG Testnet Configuration
   BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
   BLOCKDAG_CHAIN_ID=1043
   
   # Your private key for deployment (keep this secret!)
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
   
   # Contract addresses (will be updated after deployment)
   SOULDROP_CONTRACT_ADDRESS=0x...
   SEMAPHORE_VERIFIER_ADDRESS=0x...
   ```

2. **Replace `0xYOUR_PRIVATE_KEY_HERE`** with your actual private key

## 🌐 **Step 3: Configure MetaMask for BlockDAG Testnet**

### **Add BlockDAG Testnet to MetaMask:**
- **Network Name**: BlockDAG Testnet
- **RPC URL**: `https://rpc.primordial.bdagscan.com`
- **Chain ID**: `1043`
- **Currency Symbol**: `BDAG`
- **Block Explorer**: `https://primordial.bdagscan.com`

### **Get Testnet Tokens:**
- Visit the BlockDAG faucet to get testnet BDAG tokens
- These are needed for gas fees during deployment

## 🚀 **Step 4: Deploy Contracts**

### **Compile Contracts:**
```bash
npm run compile
```

### **Deploy to BlockDAG Testnet:**
```bash
npm run deploy
```

### **Expected Output:**
```
Deploying contracts with the account: 0x...
Account balance: 1000000000000000000

Deploying SemaphoreVerifier...
SemaphoreVerifier deployed to: 0x...

Deploying SoulDropNFT...
SoulDropNFT deployed to: 0x...
Group ID: 0x...
Merkle Tree Depth: 20
Base URI set to: https://ipfs.io/ipfs/QmYourMetadataCID/

=== Deployment Summary ===
Network: BlockDAG Testnet
SemaphoreVerifier: 0x...
SoulDropNFT: 0x...
Group ID: 0x...
Deployer: 0x...

Deployment info saved to deployment-info.json
```

## 📝 **Step 5: Update Frontend Configuration**

After deployment, update the contract addresses in `src/App.jsx`:

```javascript
// Contract addresses (update these after deployment)
const CONTRACT_ADDRESS = '0x...'; // Your deployed SoulDropNFT address
const GROUP_ID = '0x...'; // Your deployed group ID
```

## 🔍 **Step 6: Verify Deployment**

1. **Check BlockDAG Explorer:**
   - Visit `https://primordial.bdagscan.com`
   - Search for your contract addresses
   - Verify the contracts are deployed

2. **Test the Frontend:**
   - Start the development server: `npm run dev`
   - Open `http://localhost:3000`
   - Connect your MetaMask wallet
   - Test the complete workflow

## 📊 **Deployment Information**

After successful deployment, you'll have:

- **SemaphoreVerifier Contract**: Handles ZK proof verification
- **SoulDropNFT Contract**: Main NFT contract with soulbound functionality
- **Group ID**: Unique identifier for the Semaphore group
- **Deployer Address**: Your wallet address that deployed the contracts

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"Insufficient funds"**
   - Get more BDAG testnet tokens from the faucet

2. **"Invalid private key"**
   - Ensure your private key starts with `0x`
   - Check for extra spaces or characters

3. **"Network not found"**
   - Verify BlockDAG testnet is added to MetaMask
   - Check the RPC URL and Chain ID

4. **"Gas estimation failed"**
   - Increase gas limit in hardhat.config.js
   - Check if the RPC endpoint is working

### **Gas Configuration:**
If you encounter gas issues, update `hardhat.config.js`:
```javascript
gasPrice: 20000000000, // 20 gwei
gas: 5000000, // 5M gas limit
```

## 🔒 **Security Checklist**

- [ ] Using test wallet only
- [ ] Private key not committed to git
- [ ] .env file in .gitignore
- [ ] MetaMask connected to correct network
- [ ] Sufficient testnet tokens for gas

## 📞 **Support**

If you encounter issues:
1. Check the console for error messages
2. Verify all configuration steps
3. Ensure you have sufficient BDAG tokens
4. Check BlockDAG testnet status

---

**🎉 Congratulations!** Your ZK SoulDrop is now deployed and ready to use! 