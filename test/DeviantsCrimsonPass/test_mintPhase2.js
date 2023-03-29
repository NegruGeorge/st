const { expect, assert } = require("chai");
const { abi: DeviantSilverPassABI } = require("../../artifacts/contracts/DeviantsSilverPass.sol/DeviantsSilverPass.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
let startPhase2 = 1677416401;

describe("DeviantsCrimsonPass mintPhase2 tests", async function() {

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

    it("Should mint new nfts as holder", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase2);

        let proof2 = tree.getProof([add2.address])
        let proof3 = tree.getProof([add3.address])
        let proof5 = tree.getProof([add5.address])
        let proof6 = tree.getProof([add6.address])
        let proof8 = tree.getProof([add8.address])

        expect(await deviantsCrimsonPass.getHolderStatus(add1.address)).to.equal(9)
        expect(await deviantsCrimsonPass.getHolderStatus(add2.address)).to.equal(9)
        expect(await deviantsCrimsonPass.getHolderStatus(add3.address)).to.equal(9)
        expect(await deviantsCrimsonPass.getHolderStatus(add4.address)).to.equal(9)
        expect(await deviantsCrimsonPass.getHolderStatus(add8.address)).to.equal(0)
        expect(await deviantsCrimsonPass.getHolderStatus(add9.address)).to.equal(0)

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add3).mintPhase2(1, proof3, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add3.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add3).mintPhase2(1, proof3, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add3.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(2)

        await deviantsCrimsonPass.connect(add5).mintPhase2(2, proof5, { value: ethers.utils.parseEther("0.008") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add8).mintPhase2(2, proof8, { value: ethers.utils.parseEther("0.008") });
        expect(await deviantsCrimsonPass.balanceOf(add8.address)).to.equal(2);
    });

    it("Try to mint more than waitlist allocation", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase2);
        let proof2 = tree.getProof([add2.address])
        let proof6 = tree.getProof([add6.address])
        let proof8 = tree.getProof([add8.address])
        let proof9 = tree.getProof([add9.address])

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add8).mintPhase2(2, proof8, { value: ethers.utils.parseEther("0.008") });
        expect(await deviantsCrimsonPass.balanceOf(add8.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add8).mintPhase2(1, proof8, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(1);

        try {
            await deviantsCrimsonPass.connect(add6).mintPhase2(2, proof6, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add9).mintPhase2(1, proof9, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add9.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add9).mintPhase2(1, proof9, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add9.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add9).mintPhase2(2, proof9, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }
    });

    // it("Try to mint more than 2 per address", async function() {
    //     const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
    //     await time.setNextBlockTimestamp(startPhase2);
    //     let proof2 = tree.getProof([add2.address])
    //     let proof6 = tree.getProof([add6.address])
    //     let proof8 = tree.getProof([add8.address])
    //     let proof9 = tree.getProof([add9.address])

    //     await deviantsCrimsonPass.connect(add9).mintPhase1(2, proof9, { value: ethers.utils.parseEther("0.008") });
    //     expect(await deviantsCrimsonPass.balanceOf(add9.address)).to.equal(2);

    //     try {
    //         await deviantsCrimsonPass.connect(add2).mintPhase2(31, proof2, { value: ethers.utils.parseEther("0.124") });
    //     } catch (error) {
    //         expect(error.message).to.include("DMPC: mintAmount must be 1 or 2")
    //     }

    //     try {
    //         await deviantsCrimsonPass.connect(add6).mintPhase2(12, proof6, { value: ethers.utils.parseEther("0.044") });
    //     } catch (error) {
    //         expect(error.message).to.include("DMPC: mintAmount must be 1 or 2")
    //     }

    //     try {
    //         await deviantsCrimsonPass.connect(add8).mintPhase2(8, proof8, { value: ethers.utils.parseEther("0.032") });
    //     } catch (error) {
    //         expect(error.message).to.include("DMPC: mintAmount must be 1 or 2")
    //     }

    //     try {
    //         await deviantsCrimsonPass.connect(add9).mintPhase2(3, proof9, { value: ethers.utils.parseEther("0.012") });
    //     } catch (error) {
    //         expect(error.message).to.include("DMPC: mintAmount must be 1 or 2")
    //     }
    // });

    it("Try to mint more than two per wallet", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, add10, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase2);
        let proof6 = tree.getProof([add6.address])
        let proof8 = tree.getProof([add8.address])
        let proof9 = tree.getProof([add9.address])
        let proof2 = tree.getProof([add2.address]);

        await deviantsCrimsonPass.connect(add9).mintPhase2(2, proof9, { value: ethers.utils.parseEther("0.008") });
        expect(await deviantsCrimsonPass.balanceOf(add9.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add9).mintPhase2(1, proof9, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add8).mintPhase2(1, proof8, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add8.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add8).mintPhase2(1, proof8, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add8.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add8).mintPhase2(2, proof8, { value: ethers.utils.parseEther("0.008") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(1);

        try {
            await deviantsCrimsonPass.connect(add2).mintPhase2(2, proof2, { value: ethers.utils.parseEther("0.008") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user cannot mint more then 2 NFT")
        }

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(2);
    });

    it("Try to mint with invalid proof", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase2);
        let proof2 = tree.getProof([add2.address])
        let proof5 = tree.getProof([add5.address])
        let proof6 = tree.getProof([add6.address])

        try {
            await deviantsCrimsonPass.connect(add2).mintPhase2(2, proof5, { value: ethers.utils.parseEther("0.008") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Invalid proof")
        }

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(2);

        try {
            await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Invalid proof")
        }

        await deviantsCrimsonPass.connect(add5).mintPhase2(2, proof5, { value: ethers.utils.parseEther("0.008") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(1);

        try {
            await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Invalid proof")
        }

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(2);
    });

    it("Try to mint with globalPause true", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase2);
        let proof2 = tree.getProof([add2.address])
        let proof3 = tree.getProof([add3.address])
        let proof5 = tree.getProof([add5.address])

        await deviantsCrimsonPass.setpausePhase2(false);
        expect(await deviantsCrimsonPass.getPhase2Status()).to.equal(true)

        await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(1);

        await deviantsCrimsonPass.setGlobalPause(true);

        try {
            await deviantsCrimsonPass.connect(add2).mintPhase2(1, proof2, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: contract is paused")
        }

        await deviantsCrimsonPass.setGlobalPause(false);

        await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(1);

        await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add3).mintPhase2(1, proof3, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add3.address)).to.equal(1);

        await deviantsCrimsonPass.setGlobalPause(true);

        try {
            await deviantsCrimsonPass.connect(add3).mintPhase2(1, proof3, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: contract is paused")
        }
    });

    it("Try to mint after mintPhase2 time", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(1677409211);
        let proof2 = tree.getProof([add2.address])
        let proof5 = tree.getProof([add5.address])
        let proof6 = tree.getProof([add6.address])

        await deviantsCrimsonPass.setpausePhase2(false);
        expect(await deviantsCrimsonPass.getPhase2Status()).to.equal(true)

        await deviantsCrimsonPass.setpausePhase2(true);
        expect(await deviantsCrimsonPass.getPhase2Status()).to.equal(false)

        try {
            await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Phase2 sale closed")
        }

        try {
            await deviantsCrimsonPass.connect(add1).setpausePhase2(false);;
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner")
        }

        // //Mint befor phase1 time
        await deviantsCrimsonPass.setpausePhase2(false);
        await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(1);

        await deviantsCrimsonPass.setpausePhase2(true);

        try {
            await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Phase2 sale closed")
        }
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(1);

        await deviantsCrimsonPass.setpausePhase2(false);
        await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add2).mintPhase2(2, proof2, { value: ethers.utils.parseEther("0.008") });
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(2);

        await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(1);

        await deviantsCrimsonPass.setpausePhase2(true);

        try {
            await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: Phase2 sale closed")
        }
    });

    it("Try to mint with inccorect value", async function() {
        const { tree, deviantsCrimsonPass, deviantsGoldPass, deviantsDimondPass, deviantsSilverPass, deployer, add1, add2, add3, add4, add5, add6, add7, add8, add9, payerAccount } = await loadFixture(resetState);
        await time.setNextBlockTimestamp(startPhase2);
        let proof5 = tree.getProof([add5.address])
        let proof6 = tree.getProof([add6.address])

        await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.004") });
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(1);

        try {
            await deviantsCrimsonPass.connect(add6).mintPhase2(1, proof6, { value: ethers.utils.parseEther("0.0004") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user must send the exact price")
        }

        try {
            await deviantsCrimsonPass.connect(add5).mintPhase2(1, proof5, { value: ethers.utils.parseEther("0.008") });
        } catch (error) {
            expect(error.message).to.include("DMPC: user must send the exact price")
        }
    });

})