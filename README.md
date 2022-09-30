# Ethernaut DAO CTF

This is a Hardhat project containing the contracts and solutions to the Ethernaut DAO CTF.

Challenges are released weekly and deployed to the Goerli testnet. You can reproduce the solution by [forking the network](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks) at a proper block height and running the solution script against your local chain.

```
# npx hardhat node --fork GOERLI_RPC_URL --fork-block-number BLOCK_NUMBER
# npx hardhat run --network localhost scripts/SOLUTION_SCRIPT.js
```

## Challenges

### PrivateData

https://twitter.com/EthernautDAO/status/1543957806532833282

Contracts:
- [PrivateData.sol](./contracts/PrivateData.sol)

Solution: [private-data.js](./scripts/private-data.js)

### Wallet

https://twitter.com/EthernautDAO/status/1546101932040790016

Contracts:
- [Wallet.sol](./contracts/Wallet.sol)
- [WalletLibrary.sol](./contracts/WalletLibrary.sol)

Solution: [wallet.js](./scripts/wallet.js)

### CarMarket

https://twitter.com/EthernautDAO/status/1548638648974749696

Contracts:
- [CarFactory.sol](./contracts/CarFactory.sol)
- [CarMarket.sol](./contracts/CarMarket.sol)
- [CarToken.sol](./contracts/CarToken.sol)

Solution: [car-market.js](./scripts/car-market.js)

### Vending Machine

https://twitter.com/EthernautDAO/status/1551211568926425089

Contracts:
- [VendingMachine.sol](./contracts/VendingMachine.sol)

Solution: [vending-machine.js](./scripts/vending-machine.js)

### EthernautDaoToken

https://twitter.com/EthernautDAO/status/1553742280967835648

Contracts:
- [EthernautDaoToken.sol](./contracts/EthernautDaoToken.sol)

Solution: [ethernaut-dao-token.js](./scripts/ethernaut-dao-token.js)

### hackable

https://twitter.com/EthernautDAO/status/1556278995909427202

Contracts:
- [hackable.sol](./contracts/hackable.sol)

Solution: [hackable.js](./scripts/hackable.js)

### Switch

https://twitter.com/EthernautDAO/status/1558814930920431617

Contracts:
- [Switch.sol](./contracts/Switch.sol)

Solution: [switch.js](./scripts/switch.js)

### VNFT

https://twitter.com/EthernautDAO/status/1561352425394515968

Contracts:
- [VNFT.sol](./contracts/VNFT.sol)

Solution: [vnft.js](./scripts/vnft.js)

### EtherWallet

https://twitter.com/EthernautDAO/status/1563889138205528066

Contracts:
- [EtherWallet.sol](./contracts/EtherWallet.sol)

Solution: [ether-wallet.js](./scripts/ether-wallet.js)

### Staking

https://twitter.com/EthernautDAO/status/1571136905021952001

Contracts:
- [Staking.sol](./contracts/Staking.sol)
- [RewardToken.sol](./contracts/RewardToken.sol)
- [StakingToken.sol](./contracts/StakingToken.sol)

Solution: [staking.js](./scripts/staking.js)
