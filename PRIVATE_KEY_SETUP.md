# 🔑 Private Key Setup Guide

## ⚠️ **IMPORTANT SECURITY WARNING**

- **NEVER use your main wallet's private key**
- **NEVER share your private key with anyone**
- **NEVER commit it to git or any public repository**
- **Use a dedicated test wallet only**

## 📱 **How to Get Your Private Key from MetaMask**

### **Step 1: Open MetaMask**
1. Open your MetaMask browser extension
2. Make sure you're on the correct account (use a test account!)

### **Step 2: Access Account Details**
1. Click the **three dots (⋮)** in the top right
2. Select **Account details**

### **Step 3: Export Private Key**
1. Click **Export Private Key**
2. Enter your MetaMask password
3. Click **Submit**

### **Step 4: Copy the Private Key**
- The private key will be displayed (starts with `0x`)
- Copy the entire key (64 characters after `0x`)
- **Keep this secure and private!**

## 🔧 **Add to .env File**

1. **Open the `.env` file** in your project
2. **Find this line:**
   ```env
   PRIVATE_KEY=your_private_key_here
   ```
3. **Replace with your actual private key:**
   ```env
   PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

## ✅ **Verification**

Your private key should:
- ✅ Start with `0x`
- ✅ Be exactly 66 characters long (including `0x`)
- ✅ Contain only hexadecimal characters (0-9, a-f)
- ✅ Not have any spaces or extra characters

## 🚨 **Common Mistakes**

- ❌ **Using main wallet** - Use test wallet only
- ❌ **Adding spaces** - No spaces around the `=`
- ❌ **Missing 0x** - Must start with `0x`
- ❌ **Wrong length** - Should be 66 characters total
- ❌ **Sharing the key** - Keep it private!

## 🔒 **Security Best Practices**

1. **Use a dedicated test wallet**
2. **Only fund it with testnet tokens**
3. **Never use your main wallet**
4. **Keep the private key secure**
5. **Delete the key after deployment (optional)**

## 🎯 **Next Steps**

After setting up your private key:
1. ✅ Verify the `.env` file is in `.gitignore`
2. ✅ Test compilation: `npm run compile`
3. ✅ Deploy contracts: `npm run deploy`
4. ✅ Update frontend with contract addresses

---

**🔐 Remember: Security first! Use a test wallet only.** 