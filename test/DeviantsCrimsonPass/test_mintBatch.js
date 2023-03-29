const { expect, assert } = require("chai");
const { abi: DeviantSilverPassABI } = require("../../artifacts/contracts/DeviantsSilverPass.sol/DeviantsSilverPass.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
let startPhase1 = 1677322800;

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

    it("Try to mint before mintPhase1 time", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1 - 10);
        let proof2 = tree.getProof([add2.address])
        let proof5 = tree.getProof([add5.address])
        let proof6 = tree.getProof([add6.address])

        try {
            await deviantsCrimsonPass.connect(add5).mintPhase1(1, proof5, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Phase1 closed")
        }

        try {
            await deviantsCrimsonPass.connect(add1).setpausePhase1(false);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner")
        }

        // //Mint befor phase1 time

        await deviantsCrimsonPass.setpausePhase1(false);
        expect(await deviantsCrimsonPass.getPhase1Status()).to.equal(true);
        await deviantsCrimsonPass.connect(add5).mintPhase1(1, proof5, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(1);
        await deviantsCrimsonPass.setpausePhase1(true);
        expect(await deviantsCrimsonPass.getPhase1Status()).to.equal(false);

        await time.setNextBlockTimestamp(startPhase1);
        await deviantsCrimsonPass.setpausePhase1(false);
        expect(await deviantsCrimsonPass.getPhase1Status()).to.equal(true);

        await deviantsCrimsonPass.connect(add1).mintPhase1(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add1.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add2).mintPhase1(11, proof2, { value: ethers.utils.parseEther("0.044") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(11);

        await deviantsCrimsonPass.connect(add6).mintPhase1(7, proof6, { value: ethers.utils.parseEther("0.028") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(7);

        await deviantsCrimsonPass.setpausePhase1(true);

        try {
            await deviantsCrimsonPass.connect(add5).mintPhase1(1, proof5, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Phase1 closed")
        }

        try {
            await deviantsCrimsonPass.connect(add6).mintPhase1(1, proof6, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Phase1 closed")
        }
    });

    it("Test mintBatch", async() => {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1);

        let address = "0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146";
        await deviantsCrimsonPass.mintBatch([address.toLowerCase()], 1000)
        for (let i = 10; i <= 30; i++) {
            expect((await deviantsCrimsonPass.ownerOf(i)).toLowerCase()).to.equal(address.toLowerCase());
        }
    });

    it("Test totalSupply require", async() => {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1);

        let address = "0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146";
        try {
            await deviantsCrimsonPass.mintBatch([address.toLowerCase()], 2223)
        } catch (error) {
            expect(error.message).to.include("DMPC: maxSupply exceeded")
        }
    });

    it("Try to mintBatch as a user", async() => {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase1);

        let address = "0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146";
        try {
            await deviantsCrimsonPass.connect(add1).mintBatch([address.toLowerCase()], 6)
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    });
});