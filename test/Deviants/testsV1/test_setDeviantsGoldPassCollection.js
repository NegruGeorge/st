const { expect } = require("chai");
const { ethers } = require("hardhat");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe.only("Test setDeviantsGoldPassCollection function", function() {
    async function resetState() {
        let deviantsNFT, deployer, add1, add2, add3, add4, add5, add6, add7, erc20, hardhatVrfCoordinatorV2Mock, payerAccount, values;
        let deviantsCrimsonPass, deviantsDimondPass, deviantsGoldPass, deviantsSilverPass;

        [deployer, add1, add2, add3, add4, add5, add6, add7, add8, receiver] = await ethers.getSigners();

        payerAccount = add3;
        values = [
            ["0x1805c49ae4392f1df411f665fdb5c6bd77b23d4a"],
            ["0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146"],
            ["0xee2c99d8d6acb7940609fd6a9c5ba2129fa43004"],
            ["0x2dad87948265fb9a64f1532fe6d0bff12dfbeed1"],
            [add2.address],
            [add3.address]
        ]

        // deploy ERC721
        const NFT721aGold = await ethers.getContractFactory("DeviantsSilverPass");
        const NFT721aSilver = await ethers.getContractFactory("DeviantsSilverPass");
        const NFT721aDimond = await ethers.getContractFactory("DeviantsSilverPass");
        const NFT721aCrimson = await ethers.getContractFactory("DeviantsSilverPass");

        tree = StandardMerkleTree.of(values, ["address"]);

        deviantsSilverPass = await NFT721aSilver.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsSilverPass.deployed();
        deviantsDimondPass = await NFT721aDimond.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsDimondPass.deployed();
        deviantsGoldPass = await NFT721aGold.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsGoldPass.deployed();
        deviantsCrimsonPass = await NFT721aCrimson.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsCrimsonPass.deployed();

        await deviantsSilverPass.mintBatch([deployer.address], 100)
        await deviantsDimondPass.mintBatch([deployer.address], 100)
        await deviantsGoldPass.mintBatch([deployer.address], 2000)
        await deviantsCrimsonPass.mintBatch([deployer.address], 100)

        let i = 1;
        await deviantsSilverPass.transferFrom(deployer.address, add1.address, i);
        await deviantsSilverPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsSilverPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsSilverPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsSilverPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsSilverPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsSilverPass.transferFrom(deployer.address, add7.address, i + 6);
        await deviantsSilverPass.transferFrom(deployer.address, add1.address, 8);
        await deviantsSilverPass.transferFrom(deployer.address, add1.address, 9);
        await deviantsSilverPass.transferFrom(deployer.address, add1.address, 10);
        await deviantsSilverPass.transferFrom(deployer.address, add1.address, 11);

        await deviantsDimondPass.transferFrom(deployer.address, add1.address, i);
        await deviantsDimondPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsDimondPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsDimondPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsDimondPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsDimondPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsDimondPass.transferFrom(deployer.address, add7.address, i + 6);
        await deviantsDimondPass.transferFrom(deployer.address, add1.address, 8);
        await deviantsDimondPass.transferFrom(deployer.address, add1.address, 9);
        await deviantsDimondPass.transferFrom(deployer.address, add1.address, 10);
        await deviantsDimondPass.transferFrom(deployer.address, add1.address, 11);

        await deviantsGoldPass.transferFrom(deployer.address, add1.address, i);
        await deviantsGoldPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsGoldPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsGoldPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsGoldPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsGoldPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsGoldPass.transferFrom(deployer.address, add7.address, i + 6);
        await deviantsGoldPass.transferFrom(deployer.address, add1.address, 8);
        await deviantsGoldPass.transferFrom(deployer.address, add1.address, 9);
        await deviantsGoldPass.transferFrom(deployer.address, add1.address, 10);
        await deviantsGoldPass.transferFrom(deployer.address, add1.address, 11);

        await deviantsCrimsonPass.transferFrom(deployer.address, add1.address, i);
        await deviantsCrimsonPass.transferFrom(deployer.address, add2.address, i + 1);
        await deviantsCrimsonPass.transferFrom(deployer.address, add3.address, i + 2);
        await deviantsCrimsonPass.transferFrom(deployer.address, add4.address, i + 3);
        await deviantsCrimsonPass.transferFrom(deployer.address, add5.address, i + 4);
        await deviantsCrimsonPass.transferFrom(deployer.address, add6.address, i + 5);
        await deviantsCrimsonPass.transferFrom(deployer.address, add7.address, i + 6);
        await deviantsCrimsonPass.transferFrom(deployer.address, add1.address, 8);
        await deviantsCrimsonPass.transferFrom(deployer.address, add1.address, 9);
        await deviantsCrimsonPass.transferFrom(deployer.address, add1.address, 10);
        await deviantsCrimsonPass.transferFrom(deployer.address, add1.address, 11);

        let DeviantsNFT = await ethers.getContractFactory("Deviants");
        let vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");

        hardhatVrfCoordinatorV2Mock = await vrfCoordinatorV2Mock.deploy(0, 0);

        await hardhatVrfCoordinatorV2Mock.createSubscription();

        // subscription ID = 1; 
        await hardhatVrfCoordinatorV2Mock.fundSubscription(1, ethers.utils.parseEther("7"))

        deviantsNFT = await DeviantsNFT.deploy(
            "testURI",
            "unrevealedURI",
            "legendaryunrevealedURI",
            receiver.address,
            hardhatVrfCoordinatorV2Mock.address,
            deviantsSilverPass.address,
            deviantsDimondPass.address,
            deviantsGoldPass.address,
            deviantsCrimsonPass.address
        );

        await deviantsNFT.deployed();

        return { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver }
    }

    it("Set setDeviantsGoldPassCollection", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);

        let actualGold = await deviantsNFT.deviantsGoldPassCollection();
        expect(actualGold).to.equal(deviantsGoldPass.address);

        await deviantsNFT.setDeviantsGoldPassCollection(deviantsSilverPass.address);
        expect(await deviantsNFT.deviantsGoldPassCollection()).to.equal(deviantsSilverPass.address);
    })

    it("Try set setDeviantsGoldPassCollection as a normal user", async() => {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);

        try {
            await deviantsNFT.connect(add1).setDeviantsGoldPassCollection(deviantsSilverPass.address);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    })

    it("Set setDeviantsGoldPassCollection multiple times", async() => {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);

        await deviantsNFT.setDeviantsGoldPassCollection(deviantsSilverPass.address);
        expect(await deviantsNFT.deviantsGoldPassCollection()).to.equal(deviantsSilverPass.address);

        await deviantsNFT.setDeviantsGoldPassCollection(deviantsDimondPass.address);
        expect(await deviantsNFT.deviantsGoldPassCollection()).to.equal(deviantsDimondPass.address);
    })
})