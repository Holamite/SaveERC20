import { ethers } from "hardhat";

// async function main() {
//   const erc20 = await ethers.getContractFactory("ERC20");
//   const token = await erc20.deploy(1000000, "Holamite", "HO");
//   await token.waitForDeployment();
//   console.log(`ERC20 token deployed successfully to:, ${token.target}`);

//   const saveERC20Factory = await ethers.getContractFactory("SaveERC20");
//   const saveERC20 = await saveERC20Factory.deploy(`${token.target}`);
//   await saveERC20.waitForDeployment();
//   console.log("SaveERC20 contract successfully deployed to:", saveERC20.target);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// import { ethers } from "hardhat";

async function main() {
  const InitialAddress = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";

  const ERC20 = await ethers.deployContract("ERC20Token", [
    InitialAddress,
    100,
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
