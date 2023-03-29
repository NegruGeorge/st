const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass setPauseMint tests", function() {
    let blackPass, add1, add2, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2] = await ethers.getSigners();
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

    it("Try to mint with setPauseMint value == true", async() => {
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setAmount(add2.address, 1, 1);
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

        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        await blackPass.connect(add2).mint();
        expect(await blackPass.ownerOf(1)).to.equal(add1.address);
        expect(await blackPass.ownerOf(2)).to.equal(add2.address);
    });


    it("Try to set value as a user", async() => {
        try {
            await blackPass.connect(add1).setPauseMint(false);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    });

});