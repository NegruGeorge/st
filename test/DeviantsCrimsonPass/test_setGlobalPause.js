const { expect, assert } = require("chai");
const { abi: DeviantSilverPassABI } = require("../../artifacts/contracts/DeviantsSilverPass.sol/DeviantsSilverPass.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
let startPhase1 = 1677416553;

describe("DeviantsCrimsonPass globalPause tests", async function() {

    async function resetState() {
        let tree;
        const [deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, add10, payerAccount, secondPayer] = await ethers.getSigners();

        values = [
            ["0x1805c49ae4392f1df411f665fdb5c6bd77b23d4a"],
            ["0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146"],
            ["0xee2c99d8d6acb7940609fd6a9c5ba2129fa43004"],
            ["0x2dad87948265fb9a64f1532fe6d0bff12dfbeed1"],
            //  [add1.address],
            [add2.address],
            [add3.address],
            [add5.address],
            [add6.address],
            [add8.address],
            [add9.address],
            ["0xa907b9Ad914Be4E2E0AD5B5feCd3c6caD959ee5A"],
            ["0xA2784173d3DD644021F766951b00c8a00259887b"],
            ["0x56E3a64b080B93683F52D4217D204D7f6C50F7B9"],
            ["0xFBa408fEE62B16d185fdEC548A2609e27f46e027"],
        ]

        // deploy ERC721
        const NFT721aGold = await ethers.getContractFactory("DeviantsSilverPass");
        const NFT721aSilver = await ethers.getContractFactory("DeviantsSilverPass");
        const NFT721aDimond = await ethers.getContractFactory("DeviantsSilverPass");
        const NFT721aCrimson = await ethers.getContractFactory("DeviantsCrimsonPass");

        tree = StandardMerkleTree.of(values, ["address"]);

        const deviantsSilverPass = await NFT721aSilver.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsSilverPass.deployed();
        const deviantsDimondPass = await NFT721aDimond.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsDimondPass.deployed();
        const deviantsGoldPass = await NFT721aGold.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsGoldPass.deployed();
        const deviantsCrimsonPass = await NFT721aCrimson.deploy(tree.root, "https://test/", payerAccount.address, deviantsSilverPass.address, deviantsDimondPass.address, deviantsGoldPass.address);
        await deviantsCrimsonPass.deployed();

        await deviantsSilverPass.mintBatch([deployer.address], 10)
        await deviantsDimondPass.mintBatch([deployer.address], 10)
        await deviantsGoldPass.mintBatch([deployer.address], 2000)

        let i = 1;
        await deviantsSilverPass.transferFrom(deployer.address, add1.address, i);
        await deviantsSilverPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsSilverPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsSilverPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsSilverPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsSilverPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsSilverPass.transferFrom(deployer.address, add7.address, i + 6);

        await deviantsDimondPass.transferFrom(deployer.address, add1.address, i);
        await deviantsDimondPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsDimondPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsDimondPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsDimondPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsDimondPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsDimondPass.transferFrom(deployer.address, add7.address, i + 6);

        await deviantsGoldPass.transferFrom(deployer.address, add1.address, i);
        await deviantsGoldPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsGoldPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsGoldPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsGoldPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsGoldPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsGoldPass.transferFrom(deployer.address, add7.address, i + 6);

        return { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, add10, payerAccount };
    };

    it("Set globalPause", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1);
        let initialValue = await deviantsCrimsonPass.globalPause();
        await deviantsCrimsonPass.setGlobalPause(!initialValue);
        expect(initialValue).not.equal(await deviantsCrimsonPass.globalPause())
    })

    it("Set globalPause with true and false", async() => {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1);

        await deviantsCrimsonPass.setGlobalPause(false);
        let actualValue1 = await deviantsCrimsonPass.globalPause();
        expect(actualValue1).to.equal(false);

        await deviantsCrimsonPass.setGlobalPause(true);
        let actualValue2 = await deviantsCrimsonPass.globalPause();
        expect(actualValue2).to.equal(true);
    })

    it("Try to set globalPause as a user", async() => {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1);

        try {
            await deviantsCrimsonPass.connect(add1).setGlobalPause(true);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    })
});