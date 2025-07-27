// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockSemaphoreVerifier {
    function verifyProof(
        uint256 /* merkleRoot */,
        uint256 /* groupId */,
        bytes32 /* signal */,
        uint256 /* nullifierHash */,
        uint256 /* externalNullifier */,
        uint256[8] calldata /* proof */
    ) external pure {
        // Always succeeds for testing
    }
}
