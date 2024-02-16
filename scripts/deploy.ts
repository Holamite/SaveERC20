import { ethers } from "hardhat";

async function main() {
  const InitialAddress = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";

  const ERC20 = await ethers.deployContract("ERC20Token", [
    InitialAddress,
    "Holamite",
    "HO",
  ]);

  await ERC20.waitForDeployment();

  console.log(`Contract has been deployed to ${ERC20.target}`);

  const SaveERC20 = await ethers.deployContract("SaveERC20", [ERC20.target]);

  console.log(`Contract has been deployed to ${SaveERC20.target}`);

  await ERC20.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
