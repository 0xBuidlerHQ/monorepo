// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DinoERC721 is ERC721, Ownable {
    uint256 public totalSupply;

    constructor() ERC721("Dino", "DINO") Ownable(msg.sender) {}
}
