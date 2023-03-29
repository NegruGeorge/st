const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe("DeviantsStake setPause tests", async function() {
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

    it.only("Set globalPause", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        await stakeContract.setPause(false);
        await stakeContract.connect(add1).thirtyDaysPool(1);
        expect(await blackPass.ownerOf(1)).to.equal(stakeContract.address);
    })

    it.only("Try to stake with globalPause == true", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        try {
            await stakeContract.connect(add1).thirtyDaysPool(1);
        } catch (error) {
            expect(error.message).to.include("RCARD: you can't stake yet");
        }
    })

    it.only("Try setPause as a user", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(stakeContract.address, true);
        await blackPass.connect(add1).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        await blackPass.connect(add1).approve(stakeContract.address, 1);
        try {
            await stakeContract.connect(add1).setPause(false);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    })

});