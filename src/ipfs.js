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
 * Generate a random NFT image with different styles
 * @param {string} tokenId - Token ID
 * @param {string} ownerAddress - Owner address
 * @returns {string} SVG image data
 */
export const generateRandomNFTImage = (tokenId, ownerAddress) => {
  // Random style selection
  const styles = ['cyberpunk', 'neon', 'geometric', 'cosmic', 'matrix', 'holographic'];
  const selectedStyle = styles[Math.floor(Math.random() * styles.length)];
  
  // Random color palettes
  const colorPalettes = {
    cyberpunk: ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5'],
    neon: ['#ff0080', '#00ff80', '#8000ff', '#ff8000'],
    geometric: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    cosmic: ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    matrix: ['#00ff41', '#008f11', '#003b00', '#001100'],
    holographic: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
  };
  
  const colors = colorPalettes[selectedStyle];
  const primaryColor = colors[0];
  const secondaryColor = colors[1];
  const accentColor = colors[2];
  
  // Random geometric patterns
  const patterns = [
    // Cyberpunk
    `<defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${secondaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`,
    
    // Neon
    `<defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.8" />
        <stop offset="70%" style="stop-color:${secondaryColor};stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.3" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`,
    
    // Geometric
    `<defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`,
    
    // Cosmic
    `<defs>
      <radialGradient id="grad1" cx="30%" cy="30%" r="70%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${secondaryColor};stop-opacity:0.7" />
        <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.4" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`,
    
    // Matrix
    `<defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.7" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`,
    
    // Holographic
    `<defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.8" />
        <stop offset="25%" style="stop-color:${secondaryColor};stop-opacity:0.6" />
        <stop offset="50%" style="stop-color:${accentColor};stop-opacity:0.8" />
        <stop offset="75%" style="stop-color:${colors[3]};stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.8" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`
  ];
  
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Random background elements
  const backgroundElements = [
    // Cyberpunk elements
    `<rect x="0" y="0" width="400" height="400" fill="url(#grad1)"/>
     <rect x="20" y="20" width="360" height="360" fill="none" stroke="${primaryColor}" stroke-width="2" opacity="0.3"/>
     <rect x="40" y="40" width="320" height="320" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.2"/>
     <circle cx="100" cy="100" r="3" fill="${accentColor}" opacity="0.6"/>
     <circle cx="300" cy="120" r="2" fill="${primaryColor}" opacity="0.6"/>
     <circle cx="80" cy="300" r="4" fill="${secondaryColor}" opacity="0.6"/>
     <circle cx="320" cy="320" r="2.5" fill="${accentColor}" opacity="0.6"/>`,
    
    // Neon elements
    `<rect x="0" y="0" width="400" height="400" fill="url(#grad1)"/>
     <circle cx="200" cy="200" r="150" fill="none" stroke="${primaryColor}" stroke-width="3" opacity="0.4" filter="url(#glow)"/>
     <circle cx="200" cy="200" r="100" fill="none" stroke="${secondaryColor}" stroke-width="2" opacity="0.3" filter="url(#glow)"/>
     <circle cx="200" cy="200" r="50" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.2" filter="url(#glow)"/>`,
    
    // Geometric elements
    `<rect x="0" y="0" width="400" height="400" fill="url(#grad1)"/>
     <polygon points="200,50 350,150 200,250 50,150" fill="none" stroke="${primaryColor}" stroke-width="2" opacity="0.3"/>
     <polygon points="200,100 300,175 200,250 100,175" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.2"/>
     <circle cx="200" cy="175" r="30" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>`,
    
    // Cosmic elements
    `<rect x="0" y="0" width="400" height="400" fill="url(#grad1)"/>
     <circle cx="100" cy="100" r="2" fill="${primaryColor}" opacity="0.8"/>
     <circle cx="300" cy="80" r="1.5" fill="${secondaryColor}" opacity="0.8"/>
     <circle cx="80" cy="300" r="3" fill="${accentColor}" opacity="0.8"/>
     <circle cx="320" cy="320" r="2" fill="${primaryColor}" opacity="0.8"/>
     <circle cx="150" cy="200" r="1" fill="${secondaryColor}" opacity="0.6"/>
     <circle cx="250" cy="250" r="1.5" fill="${accentColor}" opacity="0.6"/>`,
    
    // Matrix elements
    `<rect x="0" y="0" width="400" height="400" fill="url(#grad1)"/>
     <rect x="0" y="0" width="400" height="400" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.1"/>
     <line x1="0" y1="0" x2="400" y2="400" stroke="${secondaryColor}" stroke-width="1" opacity="0.2"/>
     <line x1="400" y1="0" x2="0" y2="400" stroke="${accentColor}" stroke-width="1" opacity="0.2"/>`,
    
    // Holographic elements
    `<rect x="0" y="0" width="400" height="400" fill="url(#grad1)"/>
     <circle cx="200" cy="200" r="120" fill="none" stroke="${primaryColor}" stroke-width="2" opacity="0.3"/>
     <circle cx="200" cy="200" r="80" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.2"/>
     <circle cx="200" cy="200" r="40" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>`
  ];
  
  const selectedBackground = backgroundElements[Math.floor(Math.random() * backgroundElements.length)];
  
  // Random center icon
  const centerIcons = [
    // ZK Symbol
    `<g transform="translate(200, 180)">
       <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
       <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
       <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.7)"/>
       <text x="0" y="5" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">ZK</text>
     </g>`,
    
         // Brain Icon
     `<g transform="translate(200, 180)">
        <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <path d="M-30,-20 Q-20,-40 0,-30 Q20,-40 30,-20 Q40,0 30,20 Q20,40 0,30 Q-20,40 -30,20 Q-40,0 -30,-20" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
        <text x="0" y="5" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">BRAIN</text>
      </g>`,
     
     // Shield Icon
     `<g transform="translate(200, 180)">
        <path d="M0,-40 L20,-20 L20,20 L0,40 L-20,20 L-20,-20 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
        <text x="0" y="5" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">SHIELD</text>
      </g>`,
    
    // Infinity Symbol
    `<g transform="translate(200, 180)">
       <path d="M-30,0 Q-30,-20 -15,-20 Q0,-20 0,0 Q0,20 -15,20 Q-30,20 -30,0 M30,0 Q30,20 15,20 Q0,20 0,0 Q0,-20 15,-20 Q30,-20 30,0" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="3"/>
       <text x="0" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">ZK</text>
     </g>`,
    
    // Hexagon
    `<g transform="translate(200, 180)">
       <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
       <polygon points="0,-25 22,-12 22,12 0,25 -22,12 -22,-12" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
       <text x="0" y="5" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">ZK</text>
     </g>`
  ];
  
  const selectedIcon = centerIcons[Math.floor(Math.random() * centerIcons.length)];
  
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      ${selectedPattern}
      
      ${selectedBackground}
      
      ${selectedIcon}
      
      <!-- Token Info -->
      <text x="200" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">SoulDrop #{tokenId}</text>
      <text x="200" y="340" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="10">${selectedStyle.toUpperCase()} Soulbound</text>
      <text x="200" y="355" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Arial, sans-serif" font-size="8">${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}</text>
      
      <!-- Glow Effect -->
      <circle cx="200" cy="180" r="70" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" filter="url(#glow)"/>
    </svg>
  `;
  
  // Simple base64 encoding for SVG - avoid Unicode issues
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  } catch (error) {
    console.error('SVG encoding error:', error);
    // Fallback to simple encoding
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
};

/**
 * Create a default NFT image (SVG) - kept for backward compatibility
 * @param {string} tokenId - Token ID
 * @param {string} ownerAddress - Owner address
 * @returns {string} SVG image data
 */
export const generateDefaultNFTImage = (tokenId, ownerAddress) => {
  return generateRandomNFTImage(tokenId, ownerAddress);
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