// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const addArray= require("./treeData")
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

async function main() {
   
console.log(addArray);

    let tree = await StandardMerkleTree.of(addArray,["address"]);
    console.log(tree.root)

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xc43e0aeb5e1d71e6dd2dc2f4bd37ed1c1c0162c8384290331216b1ab93675e3a