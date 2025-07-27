// IPFS Integration for ZK SoulDrop NFTs
import axios from 'axios';

// Pinata IPFS Configuration
const PINATA_API_KEY = 'fa3b2f5724c7f7e4f517';
const PINATA_SECRET_KEY = '272755284e5e78cd41931b63ca72608dddbbb85fd096ee1858eb25604f318ad9';
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNDIwMmRiYS03NzZiLTRiZjUtYjc5ZC02NmQ3ODUwZTIyMjQiLCJlbWFpbCI6Impvc2h1YUBibG9ja2RhZy5uZXR3b3JrIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZhM2IyZjU3MjRjN2Y3ZTRmNTE3Iiwic2NvcGVkS2V5U2VjcmV0IjoiMjcyNzU1Mjg0ZTVlNzhjZDQxOTMxYjYzY2E3MjYwOGRkZGJiYjg1ZmQwOTZlZTE4NThlYjI1NjA0ZjMxOGFkOSIsImV4cCI6MTc4NTE1MTk2MX0.dGYjvve3jKS7z5oSbR4zO7GxMLTfDcbkpWodIUKouUI';

// IPFS Gateway URLs
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/'
];

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} IPFS hash
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    console.log('Uploading metadata to IPFS:', metadata);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    );
    
    const ipfsHash = response.data.IpfsHash;
    console.log('Metadata uploaded to IPFS:', ipfsHash);
    
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

/**
 * Upload image file to IPFS
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadImageToIPFS = async (imageFile) => {
  try {
    console.log('Uploading image to IPFS:', imageFile.name);
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    );
    
    const ipfsHash = response.data.IpfsHash;
    console.log('Image uploaded to IPFS:', ipfsHash);
    
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
};

/**
 * Generate NFT metadata for soulbound token
 * @param {string} tokenId - NFT token ID
 * @param {string} ownerAddress - Owner's wallet address
 * @param {string} imageHash - IPFS hash of the image
 * @param {Object} zkProof - Zero-knowledge proof data
 * @returns {Object} NFT metadata
 */
export const generateNFTMetadata = (tokenId, ownerAddress, imageHash, zkProof) => {
  const metadata = {
    name: `ZK SoulDrop #${tokenId}`,
    description: `A unique soulbound NFT minted using zero-knowledge proofs. This token represents your anonymous membership in the ZK SoulDrop community and cannot be transferred.`,
    image: `ipfs://${imageHash}`,
    external_url: `https://primordial.bdagscan.com/token/0xc04F364A0dd9af2021eb62374f87920DcEe977A8/${tokenId}`,
    attributes: [
      {
        trait_type: "Type",
        value: "Soulbound"
      },
      {
        trait_type: "Transferable",
        value: "No"
      },
      {
        trait_type: "Technology",
        value: "Zero-Knowledge Proofs"
      },
      {
        trait_type: "Protocol",
        value: "Semaphore"
      },
      {
        trait_type: "Blockchain",
        value: "BlockDAG Testnet"
      },
      {
        trait_type: "Owner",
        value: ownerAddress,
        display_type: "string"
      },
      {
        trait_type: "Mint Date",
        value: new Date().toISOString(),
        display_type: "date"
      },
      {
        trait_type: "ZK Proof Hash",
        value: zkProof ? zkProof.proofHash : "Generated on-chain",
        display_type: "string"
      }
    ],
    properties: {
      files: [
        {
          type: "image/png",
          uri: `ipfs://${imageHash}`
        }
      ],
      category: "image",
      creators: [
        {
          address: "0xc04F364A0dd9af2021eb62374f87920DcEe977A8",
          share: 100
        }
      ]
    }
  };
  
  return metadata;
};

/**
 * Get IPFS URL from hash
 * @param {string} ipfsHash - IPFS hash
 * @param {number} gatewayIndex - Gateway index (0-2)
 * @returns {string} IPFS URL
 */
export const getIPFSURL = (ipfsHash, gatewayIndex = 0) => {
  if (!ipfsHash) return null;
  
  const gateway = IPFS_GATEWAYS[gatewayIndex] || IPFS_GATEWAYS[0];
  return `${gateway}${ipfsHash}`;
};

/**
 * Create a default NFT image (SVG)
 * @param {string} tokenId - Token ID
 * @param {string} ownerAddress - Owner address
 * @returns {string} SVG image data
 */
export const generateDefaultNFTImage = (tokenId, ownerAddress) => {
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="400" height="400" fill="url(#grad1)"/>
      
      <!-- Background Pattern -->
      <circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/>
      <circle cx="350" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/>
      <circle cx="80" cy="320" r="1" fill="rgba(255,255,255,0.1)"/>
      <circle cx="320" cy="350" r="2.5" fill="rgba(255,255,255,0.1)"/>
      
      <!-- Main Icon -->
      <g transform="translate(200, 180)">
        <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
        <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.7)"/>
        
        <!-- ZK Symbol -->
        <text x="0" y="5" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">ZK</text>
      </g>
      
      <!-- Token Info -->
      <text x="200" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">SoulDrop #{tokenId}</text>
      <text x="200" y="340" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="10">Soulbound NFT</text>
      <text x="200" y="355" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Arial, sans-serif" font-size="8">${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}</text>
      
      <!-- Glow Effect -->
      <circle cx="200" cy="180" r="65" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" filter="url(#glow)"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Convert SVG to File object for IPFS upload
 * @param {string} svgData - SVG data URL
 * @param {string} filename - Filename
 * @returns {File} File object
 */
export const svgToFile = (svgData, filename = 'nft.svg') => {
  const base64 = svgData.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return new File([bytes], filename, { type: 'image/svg+xml' });
};

export default {
  uploadMetadataToIPFS,
  uploadImageToIPFS,
  generateNFTMetadata,
  getIPFSURL,
  generateDefaultNFTImage,
  svgToFile
}; 