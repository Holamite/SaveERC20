import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractSaveERC20() {
    const [owner, otherAccount] = await ethers.getSigners();

    const tokenName = "Holamite";
    const tokenSymbol = "HO";
    const initialSupply = 100;

    const ERC20 = await ethers.getContractFactory("ERC20Token");

    const erc20 = await ERC20.deploy(
      owner.address,
      initialSupply,
      tokenName,
      tokenSymbol
    );

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(erc20.getAddress());

    return { saveERC20, erc20, otherAccount };
  }

  describe("Deployment", function () {
    it("Should not deploy ERC20 to be address(0)", async function () {
      const { erc20 } = await loadFixture(deployContractSaveERC20);

      expect(erc20.target).to.not.equal(0);
    });

    it("Should not deploy SaveERC20 to be address(0)", async function () {
      const { saveERC20 } = await loadFixture(deployContractSaveERC20);

      expect(saveERC20.target).to.not.equal(0);
    });
  });

  describe("Deposit", function () {
    it("");
  });
});
