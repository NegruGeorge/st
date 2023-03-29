const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const exp = require("constants");

describe("DeviantsStake sixtyDaysPool tests", async function() {
    async function resetState() {
        [deployer, add1, add2, add3, add4] = await ethers.getSigners();

        const NFT721aBlackPass = await ethers.getContractFactory("BlackPass");
        blackPass = await NFT721aBlackPass.deploy("https://blackPass/");
        await blackPass.deployed();

        const NFT721aReward = await ethers.getContractFactory("StakeRewardNFT");
        stakeReward = await NFT721aReward.deploy("https://stakeReward/");
        await stakeReward.deployed();

        const StakeContract = await ethers.getContractFactory("DeviantsStake");
        stakeContract = await StakeContract.deploy(blackPass.address, stakeReward.address);
        await stakeContract.deployed();

        return { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 };
    };

    it.only("Test happy case", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        await stakeReward.setAllowedContract(stakeContract.address, true);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        await stakeContract.setPause(false);
        await stakeContract.connect(add1).sixtyDaysPool(1);
        expect(await blackPass.ownerOf(1)).to.equal(stakeContract.address);

        await hre.ethers.provider.send("evm_increaseTime", [66 * 24 * 60 * 60])
        await hre.ethers.provider.send("evm_mine")
        await stakeContract.connect(add1).claim();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
    })


    it.only("Gold and diamond nfts cover all time period", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 32, 1);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        await stakeReward.setAllowedContract(stakeContract.address, true);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        await stakeContract.setPause(false);
        await stakeContract.connect(add1).sixtyDaysPool(1);
        expect(await blackPass.ownerOf(1)).to.equal(stakeContract.address);

        await stakeContract.connect(add1).claim();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        let structData = await stakeContract.userSixtyDaysData(add1.address);
        expect(structData.startTime).to.equal(structData.releaseTime);
    })

    it.only("Test with penality", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        await stakeReward.setAllowedContract(stakeContract.address, true);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        await stakeContract.setPause(false);
        await stakeContract.connect(add1).sixtyDaysPool(1);
        expect(await blackPass.ownerOf(1)).to.equal(stakeContract.address);

        await hre.ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60])
        await hre.ethers.provider.send("evm_mine")
        await stakeContract.connect(add1).claim({ value: ethers.utils.parseEther("100") });
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
    })

    it.only("Try stake, but pull already used", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        await stakeReward.setAllowedContract(stakeContract.address, true);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        await stakeContract.setPause(false);
        await stakeContract.connect(add1).sixtyDaysPool(1);
        expect(await blackPass.ownerOf(1)).to.equal(stakeContract.address);

        await hre.ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60])
        await hre.ethers.provider.send("evm_mine")
        await stakeContract.connect(add1).claim({ value: ethers.utils.parseEther("100") });
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        try {
            await stakeContract.connect(add1).sixtyDaysPool(1);
        } catch (error) {
            expect(error.message).to.include("RCARD: you have already used this pool!");
        }
    })

    it.only("Try stake when contract is pause", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        await stakeReward.setAllowedContract(stakeContract.address, true);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await stakeContract.setPause(true);
        await blackPass.connect(add1).approve(stakeContract.address, 1);
        try {
            await stakeContract.connect(add1).sixtyDaysPool(1);
        } catch (error) {
            expect(error.message).to.include("RCARD: you can't stake yet!");
        }
    })

    it.only("Try without a black pass", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        await stakeReward.setAllowedContract(stakeContract.address, true);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await stakeContract.setPause(false);
        try {
            await stakeContract.connect(add2).sixtyDaysPool(1);
        } catch (error) {
            expect(error.message).to.include("RCARD: you don't have a blackpass!");
        }
    })
});