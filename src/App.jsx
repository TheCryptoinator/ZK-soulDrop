import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import { generateProof } from '@semaphore-protocol/proof';

import ThreeScene from "./components/ThreeScene";

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
  chainId: '0x411', // 1043 in hex
  chainName: 'BlockDAG Testnet',
  nativeCurrency: {
    name: 'BDAG',
    symbol: 'BDAG',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.primordial.bdagscan.com'],
  blockExplorerUrls: ['https://primordial.bdagscan.com'],
};

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [group, setGroup] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Contract addresses (update these after deployment)
  const CONTRACT_ADDRESS = '0xc04F364A0dd9af2021eb62374f87920DcEe977A8'; // Deployed SoulDropNFT address
  const GROUP_ID = '0x18c5de6932c36fa40ac7487eddfe4ee47a1ec044b570802e4fd4c982f3769b65'; // Deployed group ID

  function onButtonClick(buttonId) {
    if (buttonId === 'left') {
      connectWallet();
    } else if (buttonId === 'middle') {
      becomeEligible();
    } else if (buttonId === 'right') {
      claimSoulDrop();
    }
  }

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
    // Handle both array of account objects and array of strings
    const accountsList = Array.isArray(accounts) ? accounts : await provider.listAccounts();
    
    if (accountsList.length === 0) {
      setAccount(null);
      setContract(null);
    } else {
      // Extract address whether it's an account object or string
      const accountAddress = typeof accountsList[0] === 'string' 
        ? accountsList[0] 
        : accountsList[0].address;
      
      setAccount(accountAddress);

      if (provider) {
        try {
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, SOULDROP_ABI, signer);
          setContract(contract);

          // Check if user has already minted
          await checkMintStatus(contract, accountAddress);
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

  const becomeEligible = async () => {
    try {
      setLoading(true);

      if (!account) {
        setStatus({ type: 'error', message: 'Please connect your wallet first!' });
        return;
      }

      // Generate a real Semaphore identity
      const identity = new Identity();
      setIdentity(identity);

      // Create a real Semaphore group
      const group = new Group(GROUP_ID, 20); // 20 is the merkle tree depth
      setGroup(group);

      // Add identity to the Semaphore group
      group.addMember(identity.commitment);
      setIsEligible(true);

      setStatus({
        type: 'success',
        message: 'Identity created and joined group successfully! You can now claim your SoulDrop NFT.'
      });
    } catch (error) {
      console.error('Error becoming eligible:', error);
      setStatus({ type: 'error', message: 'Failed to become eligible: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const claimSoulDrop = async () => {
    try {
      setLoading(true);

      if (!identity || !group || !contract || !account) {
        throw new Error('Please complete all previous steps first');
      }

      if (hasMinted) {
        throw new Error('You have already minted your SoulDrop NFT');
      }

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

      // Mint the NFT
      const tx = await contract.mintSoulDrop(
        account,
        nullifierHash,
        merkleRoot,
        proof
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
      case '0x411': // 1043
        return 'BlockDAG Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const isCorrectNetwork = (chainId) => {
    return chainId === '0x411'; // BlockDAG testnet
  };

  return (
    <div className="container">
      {/* 3D Model Scene - Now at the top */}
      <ThreeScene
        onButtonClick={onButtonClick}
        account={account}
        isEligible={isEligible}
        hasMinted={hasMinted}
        loading={loading}
      />

      <div className="header">
        <h1>🧠 ZK SoulDrop</h1>
        <p>Mint your unique soulbound NFT using zero-knowledge proofs with Semaphore</p>
        <p style={{ fontSize: '0.9em', color: '#888', marginTop: '10px' }}>
          Interact with the 3D model above to complete each step
        </p>
      </div>

      {/* Status Messages */}
      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      {/* Wallet Connection Status */}
      <div className="card">
        <h2>🔗 Wallet Status</h2>
        {!account ? (
          <div className="status-info">
            <p>Click "Link Wallet" on the 3D model to connect your MetaMask wallet</p>
          </div>
        ) : (
          <div className="wallet-info">
            <div>
              <strong>Connected:</strong>
              <div className="wallet-address">
                {typeof account === 'string' ? account : account?.address || 'Unknown'}
              </div>
            </div>
            <div className="network-info">
              <div className={`network-indicator ${isCorrectNetwork(window.ethereum?.chainId || '') ? '' : 'wrong'}`}></div>
              <span>{getNetworkName(window.ethereum?.chainId || '')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Information */}
      {account && (
        <>
          {/* Step 1: Eligibility Status */}
          <div className="card">
            <div className="step">
              <h3>1️⃣ Identity Status</h3>
              <p>Your anonymous identity and group membership status.</p>
              {!isEligible ? (
                <div className="status-info">
                  <p>Click "Generate Identity" on the 3D model to create your anonymous identity and join the SoulDrop group.</p>
                </div>
              ) : (
                <div>
                  <div className="status success">You are now eligible to claim your SoulDrop NFT!</div>
                  <div className="identity-info">
                    <strong>Identity Commitment:</strong><br />
                    <span style={{ fontSize: '0.8em', wordBreak: 'break-all' }}>
                      {identity.commitment.toString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: NFT Claim Status */}
          <div className="card">
            <div className="step">
              <h3>2️⃣ SoulDrop NFT Status</h3>
              <p>Your unique soulbound NFT minting status.</p>
              {hasMinted ? (
                <div>
                  <div className="status success">You have minted your SoulDrop NFT! 🎉</div>
                  <div className="nft-preview">
                    <div className="nft-image">🧠</div>
                    <h3>ZK SoulDrop NFT</h3>
                    <p>Your unique soulbound token</p>
                  </div>
                </div>
              ) : (
                <div className="status-info">
                  {!isEligible ? (
                    <p>Complete the identity creation step first, then click "Claim SoulDrop NFT" on the 3D model.</p>
                  ) : (
                    <p>Click "Claim SoulDrop NFT" on the 3D model to mint your unique soulbound NFT using zero-knowledge proofs.</p>
                  )}
                </div>
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
          <p><strong>1. Connect Wallet:</strong> Click "Link Wallet" on the 3D model to connect your MetaMask wallet to the BlockDAG network.</p>
          <p><strong>2. Generate Identity:</strong> Click "Generate Identity" to create a unique anonymous identity and join the SoulDrop group automatically.</p>
          <p><strong>3. Claim NFT:</strong> Click "Claim SoulDrop NFT" to generate a zero-knowledge proof and mint your unique soulbound NFT.</p>
          <p><strong>Privacy:</strong> Your identity remains completely private - only the proof is submitted to the blockchain.</p>
        </div>
      </div>
    </div>
  );
}

export default App;