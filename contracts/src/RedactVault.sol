// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RedactVault {
    event VaultLabelRegistered(address indexed registrar, string label);

    mapping(address => string) private _labels;

    function register(string calldata label) external {
        _labels[msg.sender] = label;
        emit VaultLabelRegistered(msg.sender, label);
    }

    function getLabel(address account) external view returns (string memory) {
        return _labels[account];
    }
}
