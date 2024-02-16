import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractSaveERC20() {
    const [owner, Address2] = await ethers.getSigners();

    const tokenName = "Holamite";
    const tokenSymbol = "HO";

    const ERC20 = await ethers.getContractFactory("ERC20Token");

    const erc20 = await ERC20.deploy(owner.address, tokenName, tokenSymbol);

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(erc20.getAddress());

    return { saveERC20, erc20, Address2, owner };
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
    it("Should be able to check if token is deposited", async function () {
      const { saveERC20, erc20, Address2 } = await loadFixture(
        deployContractSaveERC20
      );
      const depositValue = ethers.parseUnits("1", 18);

      await erc20.transfer(Address2.address, depositValue);

      await erc20.connect(Address2).approve(saveERC20.target, depositValue);
      await saveERC20.connect(Address2).deposit(depositValue);

      const userBalance = await saveERC20.checkUserBalance(Address2.address);

      expect(userBalance).to.equal(depositValue);
    });

    it("Should be able to check if Owner can deposit token", async function () {
      const { saveERC20, erc20, owner } = await loadFixture(
        deployContractSaveERC20
      );
      const depositValue = ethers.parseUnits("1", 18);

      await erc20.approve(saveERC20.target, depositValue);

      await saveERC20.deposit(depositValue);

      const userBalance = await saveERC20.checkUserBalance(owner.address);

      expect(userBalance).to.equal(depositValue);
    });

    it("Should not be able deposit zero token value", async function () {
      const { saveERC20 } = await loadFixture(deployContractSaveERC20);

      expect(saveERC20.deposit(0)).to.be.revertedWith(
        "Zero token cannot be saved"
      );
    });
  });

  describe("Withdraw", function () {
    it("Should be able withdraw deposited token", async function () {
      // Load the necessary accounts and contracts from the fixture
      const { saveERC20, erc20, Address2 } = await loadFixture(
        deployContractSaveERC20
      );

      // Define the amount of tokens to deposit
      const depositValue = ethers.parseUnits("1", 18);

      // Transfer tokens from owner to otherAccount
      await erc20.transfer(Address2.address, depositValue);

      // Approve SaveERC20 contract to spend tokens on behalf of otherAccount
      await erc20.connect(Address2).approve(saveERC20.target, depositValue);

      // Deposit tokens into SaveERC20 contract
      await saveERC20.connect(Address2).deposit(depositValue);

      // Check the balance of otherAccount before withdrawal
      const userBalanceBefore = await saveERC20.checkUserBalance(
        Address2.address
      );

      await saveERC20.connect(Address2).withdraw(depositValue);

      const userBalanceAfter = await saveERC20.checkUserBalance(
        Address2.address
      );
      expect(userBalanceAfter).to.equal(0);
    });

    it("Should not be able to withdraw if balance is zero", async function () {
      const { saveERC20 } = await loadFixture(deployContractSaveERC20);

      expect(saveERC20.withdraw(0)).to.be.revertedWith("You are a thief!");
    });

    it("Should not be able to withdraw if funds is not insufficient", async function () {
      const { saveERC20, Address2 } = await loadFixture(
        deployContractSaveERC20
      );

      const depositValue = ethers.parseUnits("1", 18);

      expect(
        saveERC20.connect(Address2).withdraw(depositValue)
      ).to.be.revertedWith("insufficient funds");
    });
  });
});
