# 🚀 DEPLOY NOW - ZK SoulDrop

## ⚡ **Quick Deployment Steps**

### **Step 1: Get Your Private Key**
1. Open MetaMask
2. Click **three dots (⋮)** → **Account details**
3. Click **Export Private Key**
4. Enter password and copy the key (starts with `0x`)

### **Step 2: Update .env File**
Edit the `.env` file and replace:
```env
PRIVATE_KEY=your_private_key_here
```
With your actual private key:
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### **Step 3: Re-enable BlockDAG Network**
Uncomment the blockdag network in `hardhat.config.js`:
```javascript
blockdag: {
  url: process.env.BLOCKDAG_RPC_URL || "https://rpc.primordial.bdagscan.com",
  chainId: parseInt(process.env.BLOCKDAG_CHAIN_ID) || 1043,
  accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length > 0 ? [process.env.PRIVATE_KEY] : [],
  gasPrice: 20000000000, // 20 gwei
},
```

### **Step 4: Deploy Contracts**
```bash
npm run deploy
```

### **Step 5: Update Frontend**
After deployment, update `src/App.jsx`:
```javascript
const CONTRACT_ADDRESS = '0x...'; // Your deployed SoulDropNFT address
const GROUP_ID = '0x...'; // Your deployed group ID
```

## 🔑 **Private Key Format**
- Must start with `0x`
- 64 characters after `0x` (66 total)
- Only hexadecimal characters (0-9, a-f)
- No spaces or extra characters

## ⚠️ **Security Reminder**
- Use a **test wallet only**
- Never use your main wallet
- Keep the private key secure

## 🎯 **Expected Output**
```
Deploying contracts with the account: 0x...
Account balance: 1000000000000000000

Deploying SemaphoreVerifier...
SemaphoreVerifier deployed to: 0x...

Deploying SoulDropNFT...
SoulDropNFT deployed to: 0x...
Group ID: 0x...
Merkle Tree Depth: 20

=== Deployment Summary ===
Network: BlockDAG Testnet
SemaphoreVerifier: 0x...
SoulDropNFT: 0x...
Group ID: 0x...
Deployer: 0x...
```

## 🚨 **If You Get Errors**
1. **"Insufficient funds"** - Get more BDAG testnet tokens
2. **"Invalid private key"** - Check the format
3. **"Network not found"** - Verify BlockDAG testnet is added to MetaMask

---

**🎉 Ready to deploy? Follow the steps above!** 