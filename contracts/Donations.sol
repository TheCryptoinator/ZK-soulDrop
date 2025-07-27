// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

contract Donations is Ownable {
    event DonationReceived(uint256 nullifierHash, uint256 amount, string message);
    event Withdrawal(address indexed to, uint256 amount);

    uint256 public totalDonations;
    mapping(uint256 => uint256) public nullifierDonations; // nullifierHash => amount
    ISemaphoreVerifier public verifier;
    uint256 public groupId;
    mapping(uint256 => bool) public nullifierHashes;

    constructor(address _verifier, uint256 _groupId) {
        verifier = ISemaphoreVerifier(_verifier);
        groupId = _groupId;
    }

    // Accept anonymous donations with a Semaphore ZK proof
    function donateWithProof(
        string calldata message,
        uint256 merkleRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external payable {
        require(msg.value > 0, "Donation must be greater than zero");
        require(!nullifierHashes[nullifierHash], "Nullifier already used");

        // The signal can be the hash of the message or a constant, depending on privacy needs
        bytes32 signal = keccak256(abi.encodePacked("DONATE"));

        verifier.verifyProof(
            merkleRoot,
            groupId,
            signal,
            nullifierHash,
            uint256(uint160(address(this))),
            proof
        );

        nullifierHashes[nullifierHash] = true;
        nullifierDonations[nullifierHash] += msg.value;
        totalDonations += msg.value;
        emit DonationReceived(nullifierHash, msg.value, message);
    }

    // Withdraw all funds to the owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawal(owner(), balance);
    }

    // Get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
