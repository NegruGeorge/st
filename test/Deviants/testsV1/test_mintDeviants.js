const { expect } = require("chai");
const { ethers } = require("hardhat");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { BigNumber } = require("ethers");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe.only("Test mint function", function() {
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

    it("Mint Deviants, test balances", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        expect(await deviantsSilverPass.balanceOf(add1.address)).to.equal(5);
        expect(await deviantsSilverPass.balanceOf(add2.address)).to.equal(1);
        expect(await deviantsSilverPass.balanceOf(add3.address)).to.equal(1);
        expect(await deviantsSilverPass.balanceOf(add4.address)).to.equal(1);
        expect(await deviantsSilverPass.balanceOf(add5.address)).to.equal(1);
        expect(await deviantsSilverPass.balanceOf(add6.address)).to.equal(1);
        expect(await deviantsSilverPass.balanceOf(add7.address)).to.equal(1);

        expect(await deviantsDimondPass.balanceOf(add1.address)).to.equal(5);
        expect(await deviantsDimondPass.balanceOf(add2.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(add3.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(add4.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(add5.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(add6.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(add7.address)).to.equal(1);

        expect(await deviantsGoldPass.balanceOf(add1.address)).to.equal(5);
        expect(await deviantsGoldPass.balanceOf(add2.address)).to.equal(1);
        expect(await deviantsGoldPass.balanceOf(add3.address)).to.equal(1);
        expect(await deviantsGoldPass.balanceOf(add4.address)).to.equal(1);
        expect(await deviantsGoldPass.balanceOf(add5.address)).to.equal(1);
        expect(await deviantsGoldPass.balanceOf(add6.address)).to.equal(1);
        expect(await deviantsGoldPass.balanceOf(add7.address)).to.equal(1);

        expect(await deviantsCrimsonPass.balanceOf(add1.address)).to.equal(5);
        expect(await deviantsCrimsonPass.balanceOf(add2.address)).to.equal(1);
        expect(await deviantsCrimsonPass.balanceOf(add3.address)).to.equal(1);
        expect(await deviantsCrimsonPass.balanceOf(add4.address)).to.equal(1);
        expect(await deviantsCrimsonPass.balanceOf(add5.address)).to.equal(1);
        expect(await deviantsCrimsonPass.balanceOf(add6.address)).to.equal(1);
        expect(await deviantsCrimsonPass.balanceOf(add7.address)).to.equal(1);
    })

    it("Mint Deviants, test with one nft in wallet", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([1], [], [], []);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(1);

        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([], [1], [], []);

        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(2);

        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([], [], [1], []);

        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(5);

        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([], [], [], [1]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(6);
    })

    it("Mint Deviants, test multiple accounts", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([1], [], [], []);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(1);

        await deviantsSilverPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsNFT.connect(add2).mintDeviants([2], [], [], []);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsNFT.balanceOf(add2.address)).to.equal(1);

        await deviantsSilverPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsNFT.connect(add3).mintDeviants([3], [], [], []);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(1);

        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([], [1], [], []);

        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(2);

        await deviantsDimondPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsNFT.connect(add2).mintDeviants([], [2], [], []);

        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsNFT.balanceOf(add2.address)).to.equal(2);

        await deviantsDimondPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsNFT.connect(add3).mintDeviants([], [3], [], []);

        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(2);

        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([], [], [1], []);

        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(5);

        await deviantsGoldPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsNFT.connect(add2).mintDeviants([], [], [2], []);

        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsNFT.balanceOf(add2.address)).to.equal(5);

        await deviantsGoldPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsNFT.connect(add3).mintDeviants([], [], [3], []);

        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(5);

        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsNFT.connect(add1).mintDeviants([], [], [], [1]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(6);

        await deviantsCrimsonPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsNFT.connect(add2).mintDeviants([], [], [], [2]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsNFT.balanceOf(add2.address)).to.equal(6);

        await deviantsCrimsonPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsNFT.connect(add3).mintDeviants([], [], [], [3]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(6);
    })

    it("Mint Deviants, multimple nft from same account", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsNFT.connect(add1).mintDeviants([1, 8, 9, 10, 11], [], [], []);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(5);

        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsNFT.connect(add1).mintDeviants([], [1, 8, 9, 10, 11], [], []);

        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(10);

        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsNFT.connect(add1).mintDeviants([], [], [1, 8, 9, 10, 11], []);

        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(25);

        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsNFT.connect(add1).mintDeviants([], [], [], [1, 8, 9, 10, 11]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(30);
    })

    it("Mint Deviants, multimple nft from same account", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsNFT.connect(add1).mintDeviants([1, 8, 9, 10, 11], [1, 8, 9, 10, 11], [1, 8, 9, 10, 11], [1, 8, 9, 10, 11]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(30);
    })

    it("Mint Deviants, multimple nft from same account", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsNFT.connect(add1).mintDeviants([1, 8, 9, 10, 11], [1, 8, 9, 10, 11], [1, 8, 9, 10, 11], [1, 8, 9, 10, 11]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(30);
    })

    it("Mint Deviants, multimple nft from same account", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsNFT.connect(add1).mintDeviants([1, 8, 9, 10, 11], [1, 8, 9, 10, 11], [1, 8, 9, 10, 11], [1, 8, 9, 10, 11]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(30);

        await deviantsSilverPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsDimondPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsGoldPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsCrimsonPass.connect(add2).approve(deviantsNFT.address, 2);

        await deviantsNFT.connect(add2).mintDeviants([2], [2], [2], [2]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(6);

        expect(await deviantsNFT.balanceOf(add2.address)).to.equal(6);

        await deviantsSilverPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsDimondPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsGoldPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsCrimsonPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsNFT.connect(add3).mintDeviants([3], [3], [3], [3]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(7);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(7);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(7)
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(7);

        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(6);

        await deviantsSilverPass.connect(add6).approve(deviantsNFT.address, 6);
        await deviantsDimondPass.connect(add6).approve(deviantsNFT.address, 6);
        await deviantsGoldPass.connect(add6).approve(deviantsNFT.address, 6);
        await deviantsCrimsonPass.connect(add6).approve(deviantsNFT.address, 6);
        await deviantsNFT.connect(add6).mintDeviants([6], [6], [6], [6]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(8);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(8);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(8)
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(8);

        expect(await deviantsNFT.balanceOf(add6.address)).to.equal(6);

        await deviantsSilverPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsDimondPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsGoldPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsCrimsonPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsNFT.connect(add7).mintDeviants([7], [7], [7], [7]);

        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(9);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(9);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(9)
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(9);

        expect(await deviantsNFT.balanceOf(add7.address)).to.equal(6);
    })

    it("Mint Deviants, mint multiple nft with different collection balance", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsSilverPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsDimondPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsGoldPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsCrimsonPass.connect(add2).approve(deviantsNFT.address, 2);

        await deviantsSilverPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsDimondPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsGoldPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsCrimsonPass.connect(add3).approve(deviantsNFT.address, 3);

        await deviantsSilverPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsDimondPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsGoldPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsCrimsonPass.connect(add7).approve(deviantsNFT.address, 7);

        await deviantsNFT.connect(add1).mintDeviants([1], [8, 9], [11, 10], [1]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(1);

        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(10);

        await deviantsNFT.connect(add1).mintDeviants([10, 11], [1], [1, 8, 9], [9, 10, 11]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(4);

        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(25);

        await deviantsNFT.connect(add2).mintDeviants([2], [], [2], [2]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(4);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);

        expect(await deviantsNFT.balanceOf(add2.address)).to.equal(5);

        await deviantsNFT.connect(add3).mintDeviants([3], [], [], [3]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(6);

        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(2);

        await deviantsNFT.connect(add7).mintDeviants([7], [7], [], []);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(4)
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(6);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(6);

        expect(await deviantsNFT.balanceOf(add7.address)).to.equal(2);
    })

    it("Try to mint when pauseMint is true", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsSilverPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsDimondPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsGoldPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsCrimsonPass.connect(add2).approve(deviantsNFT.address, 2);

        await deviantsSilverPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsDimondPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsGoldPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsCrimsonPass.connect(add3).approve(deviantsNFT.address, 3);

        await deviantsSilverPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsDimondPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsGoldPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsCrimsonPass.connect(add7).approve(deviantsNFT.address, 7);

        await deviantsNFT.connect(add1).mintDeviants([1], [8, 9], [11, 10], [1]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(1);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(2);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(1);

        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(10);

        await deviantsNFT.connect(add1).mintDeviants([10, 11], [1], [1, 8, 9], [9, 10, 11]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(4);

        expect(await deviantsNFT.balanceOf(add1.address)).to.equal(25);


        expect(await deviantsNFT.pauseMint()).to.equal(false);
        await deviantsNFT.setPauseMint(true);
        expect(await deviantsNFT.pauseMint()).to.equal(true);
        try {
            await deviantsNFT.connect(add7).mintDeviants([7], [7], [], []);
        } catch (error) {
            expect(error.message).to.include("DNFT: Mint closed");
        }

        await deviantsNFT.setPauseMint(false);
        expect(await deviantsNFT.pauseMint()).to.equal(false);

        await deviantsNFT.connect(add3).mintDeviants([3], [], [], [3]);

        expect(await deviantsSilverPass.balanceOf(receiver.address)).to.equal(4);
        expect(await deviantsDimondPass.balanceOf(receiver.address)).to.equal(3);
        expect(await deviantsGoldPass.balanceOf(receiver.address)).to.equal(5);
        expect(await deviantsCrimsonPass.balanceOf(receiver.address)).to.equal(5);

        expect(await deviantsNFT.balanceOf(add3.address)).to.equal(2);

        await deviantsNFT.setPauseMint(true);
        expect(await deviantsNFT.pauseMint()).to.equal(true);

        try {
            await deviantsNFT.connect(add2).mintDeviants([2], [], [2], [2]);
        } catch (error) {
            expect(error.message).to.include("DNFT: Mint closed");
        }
    })

    it("Try to mint more than total supply", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsSilverPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsDimondPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsGoldPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsCrimsonPass.connect(add2).approve(deviantsNFT.address, 2);

        await deviantsSilverPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsDimondPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsGoldPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsCrimsonPass.connect(add3).approve(deviantsNFT.address, 3);

        await deviantsSilverPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsDimondPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsGoldPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsCrimsonPass.connect(add7).approve(deviantsNFT.address, 7);


        await deviantsNFT.mintBatch([add1.address], 9999);
        try {
            await deviantsNFT.connect(add1).mintDeviants([1], [8, 9], [11, 10], [1]);
        } catch (error) {
            expect(error.message).to.include("DNFT: maxSupply exceeded for now");
        }
    })

    it("Try to mint more than total supply", async function() {
        const { deviantsNFT, deviantsSilverPass, deviantsDimondPass, deviantsGoldPass, deviantsCrimsonPass, add1, add2, add3, add4, add5, add6, add7, payerAccount, receiver } = await loadFixture(resetState);
        await deviantsNFT.setPauseMint(false)
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsSilverPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsDimondPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsGoldPass.connect(add1).approve(deviantsNFT.address, 11);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 1);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 8);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 9);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 10);
        await deviantsCrimsonPass.connect(add1).approve(deviantsNFT.address, 11);

        await deviantsSilverPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsDimondPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsGoldPass.connect(add2).approve(deviantsNFT.address, 2);
        await deviantsCrimsonPass.connect(add2).approve(deviantsNFT.address, 2);

        await deviantsSilverPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsDimondPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsGoldPass.connect(add3).approve(deviantsNFT.address, 3);
        await deviantsCrimsonPass.connect(add3).approve(deviantsNFT.address, 3);

        await deviantsSilverPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsDimondPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsGoldPass.connect(add7).approve(deviantsNFT.address, 7);
        await deviantsCrimsonPass.connect(add7).approve(deviantsNFT.address, 7);

        await deviantsNFT.setLast300On(true);

        await deviantsNFT.mintBatch([add1.address], 9999);
        try {
            await deviantsNFT.connect(add1).mintDeviants([1], [8, 9], [11, 10], [1]);
        } catch (error) {
            expect(error.message).to.include("DNFT: maxSupply exceeded");
        }
    })

})