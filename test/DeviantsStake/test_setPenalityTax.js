const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe("DeviantsStake setPenalityTax tests", async function() {
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

    it.only("Test initial penality tax value", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        let initialValue = ethers.utils.formatEther((await stakeContract.penalityTax()));
        expect(Number(initialValue)).to.equal(100);
    })

    it.only("Test penality tax value", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        let initialValue = ethers.utils.formatEther((await stakeContract.penalityTax()));
        expect(Number(initialValue)).to.equal(100);

        await stakeContract.setPenalityTax(ethers.utils.parseUnits("123", "ether"));
        let valueAfterSet = ethers.utils.formatEther((await stakeContract.penalityTax()));
        expect(Number(valueAfterSet)).to.equal(123);
    })

    it.only("Try  penality tax as a user", async function() {
        const { blackPass, stakeReward, stakeContract, deployer, add1, add2, add3, add4 } = await loadFixture(resetState);
        await stakeContract.setPenalityTax(ethers.utils.parseUnits("123", "ether"));
        let valueAfterSet = ethers.utils.formatEther((await stakeContract.penalityTax()));
        expect(Number(valueAfterSet)).to.equal(123);

        try {
            await stakeContract.connect(add1).setPenalityTax(ethers.utils.parseUnits("123", "ether"));
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    })

});