# Vercel Deployment Guide for ZK SoulDrop

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Version 16 or higher (Vercel will handle this automatically)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository is ready for deployment:

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty if root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from your project directory:
```bash
vercel
```

### 3. Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

```
BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
BLOCKDAG_CHAIN_ID=1043
SOULDROP_CONTRACT_ADDRESS=your_deployed_contract_address
SEMAPHORE_VERIFIER_ADDRESS=your_deployed_verifier_address
```

**Note**: Do NOT add your private key to Vercel environment variables. The frontend should not have access to private keys.

### 4. Build Configuration

The project is already configured with:
- ✅ Vite build system
- ✅ React frontend
- ✅ Proper build scripts
- ✅ Vercel configuration file

### 5. Post-Deployment

After deployment:

1. **Test the Application**: Visit your Vercel URL and test all functionality
2. **Update Contract Addresses**: If you deploy new contracts, update the environment variables
3. **Monitor Performance**: Use Vercel Analytics to monitor your app's performance

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility
   - Check build logs in Vercel dashboard

2. **Environment Variables**:
   - Verify all required env vars are set in Vercel
   - Check that contract addresses are correct

3. **IPFS Issues**:
   - The IPFS integration uses Pinata API keys (already configured)
   - Ensure CORS is properly configured

### Performance Optimization

1. **Image Optimization**: Vercel automatically optimizes images
2. **Caching**: Static assets are cached automatically
3. **CDN**: Vercel provides global CDN for fast loading

## Security Considerations

1. **Private Keys**: Never expose private keys in frontend code
2. **API Keys**: IPFS API keys are already configured for public use
3. **Environment Variables**: Only add non-sensitive configuration

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Monitor build and runtime errors
3. **Performance**: Track Core Web Vitals

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- ZK SoulDrop Issues: Create an issue in your repository

---

**Your ZK SoulDrop app is now ready for deployment! 🚀** 