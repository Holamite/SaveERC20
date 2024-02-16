// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20 {
  constructor(address owner, uint256 initialSupply, string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {
    _mint(owner, initialSupply);
  }
}