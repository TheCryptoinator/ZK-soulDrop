// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SoulDropNFT
 * @dev A soulbound (non-transferable) NFT that can only be minted once per person
 * using zero-knowledge proofs via Semaphore
 */
contract SoulDropNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Semaphore group ID for this SoulDrop
    uint256 public groupId;
    
    // Mapping to track used nullifier hashes to prevent double minting
    mapping(uint256 => bool) public usedNullifierHashes;
    
    // Verifier contract for ZK proofs (simplified for demo)
    address public verifier;
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    // Events
    event SoulDropMinted(address indexed to, uint256 indexed tokenId, uint256 nullifierHash);
    event GroupCreated(uint256 indexed groupId);
    
    /**
     * @dev Constructor
     * @param _name NFT collection name
     * @param _symbol NFT collection symbol
     * @param _verifier Semaphore verifier contract address
     * @param _groupId Unique group ID for this SoulDrop
     * @param _merkleTreeDepth Depth of the Merkle tree (unused in simplified version)
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _verifier,
        uint256 _groupId,
        uint8 _merkleTreeDepth
    ) ERC721(_name, _symbol) {
        verifier = _verifier;
        groupId = _groupId;
        emit GroupCreated(groupId);
    }
    
    /**
     * @dev Mint a SoulDrop NFT using a Semaphore proof
     * @param receiver Address to receive the NFT
     * @param nullifierHash Unique hash to prevent double minting
     * @param merkleRoot Root of the Merkle tree
     * @param proof ZK proof array
     */
    function mintSoulDrop(
        address receiver,
        uint256 nullifierHash,
        uint256 merkleRoot,
        uint256[8] calldata proof
    ) external {
        // Check if nullifier hash has already been used
        require(!usedNullifierHashes[nullifierHash], "SoulDrop: nullifier hash already used");
        
        // In a full implementation, this would verify the Semaphore proof
        // For demo purposes, we'll do basic validation
        require(proof.length == 8, "SoulDrop: invalid proof length");
        require(merkleRoot != 0, "SoulDrop: invalid merkle root");
        require(nullifierHash != 0, "SoulDrop: invalid nullifier hash");
        
        // TODO: Add actual Semaphore proof verification here
        // This would call the verifier contract to validate the ZK proof
        
        // Mark nullifier hash as used
        usedNullifierHashes[nullifierHash] = true;
        
        // Mint the NFT
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(receiver, newTokenId);
        
        emit SoulDropMinted(receiver, newTokenId, nullifierHash);
    }
    
    /**
     * @dev Override transfer functions to make NFT soulbound (non-transferable)
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("SoulDrop: NFT is soulbound and cannot be transferred");
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("SoulDrop: NFT is soulbound and cannot be transferred");
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("SoulDrop: NFT is soulbound and cannot be transferred");
    }
    
    /**
     * @dev Override approve functions to prevent approvals
     */
    function approve(address to, uint256 tokenId) public virtual override {
        revert("SoulDrop: NFT is soulbound and cannot be approved");
    }
    
    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert("SoulDrop: NFT is soulbound and cannot be approved");
    }
    
    /**
     * @dev Set base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Get token URI
     * @param tokenId Token ID
     * @return Token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "SoulDrop: URI query for nonexistent token");
        
        string memory baseURI = _baseTokenURI;
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, _toString(tokenId), ".json")) : "";
    }
    
    /**
     * @dev Convert uint256 to string
     * @param value Number to convert
     * @return String representation
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    /**
     * @dev Check if address has already minted
     * @param user Address to check
     * @return True if user has minted
     */
    function hasMinted(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
    
    /**
     * @dev Get total supply
     * @return Total number of minted NFTs
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Demo function to mint without ZK proof (for testing)
     * @param receiver Address to receive the NFT
     */
    function demoMint(address receiver) external onlyOwner {
        require(balanceOf(receiver) == 0, "SoulDrop: user already has NFT");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(receiver, newTokenId);
        
        emit SoulDropMinted(receiver, newTokenId, 0);
    }
} 