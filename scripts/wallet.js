const hre = require("hardhat");
const { ethers } = hre;

const address = '0x19c80e4ec00faaa6ca3b41b17b75f7b0f4d64cb7';

async function main() {
  const [signer] = await ethers.getSigners();

  // the wallet implementation has a public initWallet method that can
  // be called again to override the owners
  const WalletLibrary = await ethers.getContractFactory("WalletLibrary");
  const instance = WalletLibrary.attach(address);

  const initWalletTx = await instance.initWallet([signer.address], 1);
  console.log('InitWallet TX: ', initWalletTx.hash);
  await initWalletTx.wait();
  console.log('Wallet re initialized');

  const balance = await ethers.provider.getBalance(address);

  const submitTx = await instance.submitTransaction(signer.address, balance, []);
  console.log('Submit TX: ', submitTx.hash);
  const receipt = await submitTx.wait();
  console.log('Transaction submitted');

  const txIndex = receipt.events[0].args[1];

  const confirmTx = await instance.confirmTransaction(txIndex);
  console.log('Confirm TX: ', confirmTx.hash);
  await confirmTx.wait();
  console.log('Transaction confirmed');

  const executeTx = await instance.executeTransaction(txIndex);
  console.log('Execute TX: ', executeTx.hash);
  await executeTx.wait();
  console.log('Transaction executed');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
