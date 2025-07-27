import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Contract ABI (simplified for demo)
const SOULDROP_ABI = [
  "function mintSoulDrop(address receiver, uint256 nullifierHash, uint256 merkleRoot, uint256[8] proof) external",
  "function hasMinted(address user) external view returns (bool)",
  "function totalSupply() external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function balanceOf(address owner) external view returns (uint256)"
];

// BlockDAG testnet configuration
const BLOCKDAG_CONFIG = {
  chainId: '0x3039', // 12345 in hex
  chainName: 'BlockDAG Testnet',
  nativeCurrency: {
    name: 'BDAG',
    symbol: 'BDAG',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.blockdag.network'],
  blockExplorerUrls: ['https://testnet-explorer.blockdag.network'],
};

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [group, setGroup] = useState(null);
  const [isInGroup, setIsInGroup] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Contract addresses (update these after deployment)
  const CONTRACT_ADDRESS = '0x...'; // Update with deployed contract address
  const GROUP_ID = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());

        // Get initial account
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            await handleAccountsChanged(accounts);
          }
        } catch (error) {
          console.error('Error getting initial accounts:', error);
        }
      } else {
        setStatus({ type: 'error', message: 'MetaMask is not installed. Please install MetaMask to use this app.' });
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setStatus({ type: 'error', message: 'Failed to initialize app: ' + error.message });
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setContract(null);
    } else {
      const account = accounts[0];
      setAccount(account);

      if (provider) {
        try {
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, SOULDROP_ABI, signer);
          setContract(contract);

          // Check if user has already minted
          await checkMintStatus(contract, account);
          await getTotalSupply(contract);
        } catch (error) {
          console.error('Error setting up contract:', error);
        }
      }
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Add BlockDAG testnet if not already added
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BLOCKDAG_CONFIG],
        });
      } catch (error) {
        // Chain might already be added
        console.log('Chain already added or user rejected');
      }

      setStatus({ type: 'success', message: 'Wallet connected successfully!' });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatus({ type: 'error', message: 'Failed to connect wallet: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const generateIdentity = async () => {
    try {
      setLoading(true);
<<<<<<< Updated upstream
      
      // Generate a mock identity for demo purposes
      const mockIdentity = {
        commitment: ethers.keccak256(ethers.toUtf8Bytes(`identity_${Date.now()}_${Math.random()}`)),
        toString: () => mockIdentity.commitment
      };
      setIdentity(mockIdentity);
      
      // Create a mock group for demo
      const mockGroup = {
        id: GROUP_ID,
        addMember: () => {},
        generateMerkleProof: () => []
      };
      setGroup(mockGroup);
      
      setStatus({ 
        type: 'success', 
        message: 'Identity generated successfully! You can now join the group.' 
=======

      // Generate a real Semaphore identity
      const identity = new Identity();
      setIdentity(identity);

      // Create a real Semaphore group
      const group = new Group(GROUP_ID, 20); // 20 is the merkle tree depth
      setGroup(group);

      setStatus({
        type: 'success',
        message: 'Identity generated successfully! You can now join the group.'
>>>>>>> Stashed changes
      });
    } catch (error) {
      console.error('Error generating identity:', error);
      setStatus({ type: 'error', message: 'Failed to generate identity: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async () => {
    try {
      setLoading(true);

      if (!identity || !group) {
        throw new Error('Please generate an identity first');
      }

      // Simulate joining the group
      setIsInGroup(true);

      setStatus({
        type: 'success',
        message: 'Successfully joined the group! You can now claim your SoulDrop NFT.'
      });
    } catch (error) {
      console.error('Error joining group:', error);
      setStatus({ type: 'error', message: 'Failed to join group: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const claimSoulDrop = async () => {
    console.log('abc')
    try {
      setLoading(true);

      if (!identity || !group || !contract || !account) {
        throw new Error('Please complete all previous steps first');
      }

      if (hasMinted) {
        throw new Error('You have already minted your SoulDrop NFT');
      }

<<<<<<< Updated upstream
      // For demo purposes, we'll use mock proof data
      // In production, this would generate actual ZK proofs
      const mockProof = Array(8).fill(ethers.getBigInt(1));
      const mockNullifierHash = ethers.keccak256(ethers.toUtf8Bytes(account + Date.now()));
      const mockMerkleRoot = ethers.keccak256(ethers.toUtf8Bytes("demo_root"));
=======
      // Generate real ZK proof using Semaphore
      const externalNullifier = ethers.keccak256(ethers.toUtf8Bytes("ZK SoulDrop"));
      const signal = ethers.keccak256(ethers.toUtf8Bytes(account));

      const { proof, publicSignals } = await generateProof(
        identity,
        group,
        externalNullifier,
        signal
      );

      const nullifierHash = publicSignals.nullifierHash;
      const merkleRoot = publicSignals.merkleRoot;
>>>>>>> Stashed changes

      // Mint the NFT
      const tx = await contract.mintSoulDrop(
        account,
        mockNullifierHash,
        mockMerkleRoot,
        mockProof
      );

      setStatus({
        type: 'info',
        message: 'Transaction submitted! Waiting for confirmation...'
      });

      await tx.wait();

      setStatus({
        type: 'success',
        message: 'SoulDrop NFT minted successfully! 🎉'
      });

      setHasMinted(true);
      await getTotalSupply(contract);

    } catch (error) {
      console.error('Error claiming SoulDrop:', error);
      setStatus({ type: 'error', message: 'Failed to claim SoulDrop: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkMintStatus = async (contract, account) => {
    try {
      const minted = await contract.hasMinted(account);
      setHasMinted(minted);
    } catch (error) {
      console.error('Error checking mint status:', error);
    }
  };

  const getTotalSupply = async (contract) => {
    try {
      const supply = await contract.totalSupply();
      setTotalSupply(Number(supply));
    } catch (error) {
      console.error('Error getting total supply:', error);
    }
  };

  const getNetworkName = (chainId) => {
    if (!chainId) return 'Unknown Network';

    switch (chainId) {
      case '0x3039': // 12345
        return 'BlockDAG Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const isCorrectNetwork = (chainId) => {
    return chainId === '0x3039'; // BlockDAG testnet
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🧠 ZK SoulDrop</h1>
        <p>Mint your unique soulbound NFT using zero-knowledge proofs with Semaphore</p>
      </div>

      {/* Status Messages */}
      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      {/* Wallet Connection */}
      <div className="card">
        <h2>🔗 Connect Wallet</h2>
        {!account ? (
          <button
            className={`button ${loading ? 'loading' : ''}`}
            onClick={connectWallet}
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            Connect MetaMask
          </button>
        ) : (
          <div className="wallet-info">
            <div>
              <strong>Connected:</strong>
              <div className="wallet-address">{account?.toString() || account}</div>
            </div>
            <div className="network-info">
              <div className={`network-indicator ${isCorrectNetwork(window.ethereum?.chainId || '') ? '' : 'wrong'}`}></div>
              <span>{getNetworkName(window.ethereum?.chainId || '')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Steps */}
      {account && (
        <>
          {/* Step 1: Generate Identity */}
          <div className="card">
            <div className="step">
              <h3>1️⃣ Generate Identity</h3>
              <p>Create your unique Semaphore identity for zero-knowledge proof generation.</p>
              {!identity ? (
                <button
                  className={`button ${loading ? 'loading' : ''}`}
                  onClick={generateIdentity}
                  disabled={loading}
                >
                  {loading && <span className="loading-spinner"></span>}
                  Generate Identity
                </button>
              ) : (
                <div>
                  <div className="status success">Identity generated successfully!</div>
                  <div className="identity-info">
                    <strong>Identity Commitment:</strong><br />
                    {identity.commitment}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Claim SoulDrop NFT */}
          <div className="card">
            <div className="step">
              <h3>2️⃣ Claim SoulDrop NFT</h3>
              <p>Mint your unique soulbound NFT using zero-knowledge proofs.</p>
              {hasMinted ? (
                <div>
                  <div className="status success">You have already minted your SoulDrop NFT! 🎉</div>
                  <div className="nft-preview">
                    <div className="nft-image">🧠</div>
                    <h3>ZK SoulDrop NFT</h3>
                    <p>Your unique soulbound token</p>
                  </div>
                </div>
              ) : (
                <button
                  className={`button ${loading ? 'loading' : ''}`}
                  onClick={claimSoulDrop}
                  disabled={!identity || loading}
                >
                  {loading && <span className="loading-spinner"></span>}
                  Claim SoulDrop NFT
                </button>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <h3>📊 Statistics</h3>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <div>
                <strong>Total Minted:</strong> {totalSupply}
              </div>
              <div>
                <strong>Your Status:</strong> {hasMinted ? 'Minted ✅' : 'Not Minted ❌'}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Instructions */}
      <div className="card">
        <h3>📖 How It Works</h3>
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>1. Generate Identity:</strong> Create a unique Semaphore identity that proves you're a real person without revealing any personal information.</p>
          <p><strong>2. Claim NFT:</strong> Generate a zero-knowledge proof that you're a group member and mint your unique soulbound NFT.</p>
          <p><strong>Privacy:</strong> Your identity remains completely private - only the proof is submitted to the blockchain.</p>
        </div>
      </div>
    </div>
  );
}

export default App; 