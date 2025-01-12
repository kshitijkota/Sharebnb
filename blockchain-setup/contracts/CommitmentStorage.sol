// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommitmentStorage {
    struct Commitment {
        address user;
        bytes32 commitmentHash;
        uint256 timestamp;
    }

    mapping(address => Commitment[]) private commitments;

    event CommitmentAdded(address indexed user, bytes32 indexed commitmentHash, uint256 timestamp);

    function addCommitment(bytes32 _commitmentHash) external {
        Commitment memory newCommitment = Commitment({
            user: msg.sender,
            commitmentHash: _commitmentHash,
            timestamp: block.timestamp
        });

        commitments[msg.sender].push(newCommitment);

        emit CommitmentAdded(msg.sender, _commitmentHash, block.timestamp);
    }

    function getCommitments(address _user) external view returns (Commitment[] memory) {
        return commitments[_user];
    }
}