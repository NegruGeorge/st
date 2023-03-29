const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass mint tests", function() {
    let blackPass, add1, add2, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2, add3, add4] = await ethers.getSigners();
        const NFT721a = await ethers.getContractFactory("BlackPass");

        blackPass = await NFT721a.deploy("https://test/");
        await blackPass.deployed();
    });

    it("Mint two nfts", async() => {
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setAmount(add2.address, 1, 1);
        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        await blackPass.connect(add2).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        expect(await blackPass.ownerOf(2)).to.equal(add2.address);
    });

    it("Mint only with gold nft", async() => {
        await blackPass.setAmount(add1.address, 3, 0);
        await blackPass.setAmount(add2.address, 1, 0);
        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        await blackPass.connect(add2).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        expect(await blackPass.ownerOf(2)).to.equal(add2.address);
    });

    it("Mint only with diamond nft", async() => {
        await blackPass.setAmount(add1.address, 0, 1);
        await blackPass.setAmount(add2.address, 0, 2);
        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        await blackPass.connect(add2).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        expect(await blackPass.ownerOf(2)).to.equal(add2.address);
    });

    it("Try to mint when mint is close", async() => {
        await blackPass.setAmount(add1.address, 0, 1);
        await blackPass.setAmount(add2.address, 0, 2);
        try {
            await blackPass.connect(add1).mint();
        } catch (error) {
            expect(error.message).to.include("BLKP: Mint closed");
        }
        try {
            await blackPass.connect(add2).mint();
        } catch (error) {
            expect(error.message).to.include("BLKP: Mint closed");
        }
    });

    it("Try to mint without nft", async() => {
        await blackPass.setPauseMint(false);
        try {
            await blackPass.connect(add1).mint();
        } catch (error) {
            expect(error.message).to.include("BLKP: you don't own any nft gold or diamond!");
        }
    });

    it("Try to mint twice", async() => {
        await blackPass.setAmount(add1.address, 0, 1);
        await blackPass.setAmount(add2.address, 0, 2);
        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        try {
            await blackPass.connect(add1).mint();
        } catch (error) {
            expect(error.message).to.include("BLKP: user already minted an BKLP NFT!");
        }
    });

    it("Mint nfts and trade", async() => {
        await blackPass.setAmount(add1.address, 0, 1);
        await blackPass.setAmount(add2.address, 0, 2);
        await blackPass.setPauseMint(false);
        await blackPass.setAllowedContract(add4.address, true);

        await blackPass.connect(add1).mint();
        await blackPass.connect(add2).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        expect(await blackPass.ownerOf(2)).to.equal(add2.address);

        await blackPass.connect(add1).approve(add4.address, 1);
        await blackPass.connect(add1).transferFrom(add1.address, add4.address, 1);
        expect(await blackPass.ownerOf(1)).to.equal(add4.address);

        await blackPass.connect(add2).setApprovalForAll(add4.address, 2);
        await blackPass.connect(add2).transferFrom(add2.address, add4.address, 2);
        expect(await blackPass.ownerOf(2)).to.equal(add4.address);

        await blackPass.connect(add4)["safeTransferFrom(address,address,uint256)"](add4.address, add1.address, 1);
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);

        try {
            await blackPass.connect(add1).approve(add3.address, 1);
        } catch (error) {
            expect(error.message).to.include("BLKP: Invalid staking address");
        }

        try {
            await blackPass.connect(add1).setApprovalForAll(add3.address, 1);
        } catch (error) {
            expect(error.message).to.include("BLKP: Invalid staking address");
        }

        try {
            await blackPass.connect(add1).transferFrom(add1.address, add2.address, 1);
        } catch (error) {
            expect(error.message).to.include("BLKP: Invalid staking address");
        }

        try {
            await blackPass.connect(add1)["safeTransferFrom(address,address,uint256)"](add1.address, add2.address, 1);
        } catch (error) {
            expect(error.message).to.include("BLKP: Invalid staking address");
        }

        try {
            await blackPass.connect(add1)["safeTransferFrom(address,address,uint256)"](add1.address, add2.address, 1);
        } catch (error) {
            expect(error.message).to.include("BLKP: Invalid staking address");
        }

        try {
            await blackPass.connect(add1)["safeTransferFrom(address,address,uint256,bytes)"](add1.address, add2.address, 1, "0x");
        } catch (error) {
            expect(error.message).to.include("BLKP: Invalid staking address");
        }
    });


});