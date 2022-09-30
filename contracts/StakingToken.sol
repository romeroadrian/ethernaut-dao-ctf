// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingToken is ERC20, Ownable {
    constructor() ERC20("STK", "STK") {}

    function faucet() public {
        uint256 amount = 1000 * 10 ** 18;
        _mint(msg.sender, amount);
    }
}
