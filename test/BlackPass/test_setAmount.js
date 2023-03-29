const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass setAmount tests", function() {
    let blackPass, add1, add2, add3, add4, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2, add3, add4] = await ethers.getSigners();
        const NFT721a = await ethers.getContractFactory("BlackPass");

        blackPass = await NFT721a.deploy("https://test/");
        await blackPass.deployed();
    });

    it("Test setAmount function", async() => {
        await blackPass.setAmount(add1.address, 1, 1);
        expect(await blackPass.diamondAmount(add1.address)).to.equal(1);
        expect(await blackPass.goldAmount(add1.address)).to.equal(1);

        await blackPass.setAmount(add2.address, 21, 41);
        expect(await blackPass.diamondAmount(add2.address)).to.equal(41);
        expect(await blackPass.goldAmount(add2.address)).to.equal(21);
    });

    it("Test setAmount function", async() => {
        await blackPass.setAmount(add1.address, 11, 14);
        expect(await blackPass.diamondAmount(add1.address)).to.equal(14);
        expect(await blackPass.goldAmount(add1.address)).to.equal(11);

        await blackPass.setAmount(add2.address, 211, 111);
        expect(await blackPass.diamondAmount(add2.address)).to.equal(111);
        expect(await blackPass.goldAmount(add2.address)).to.equal(211);
    });

    it("Try set more than max supply", async() => {
        try {
            await blackPass.setAmount(add3.address, 223, 2);
        } catch (error) {
            expect(error.message).to.include("BLKP: gold max supply exceeded!");
        }

        try {
            await blackPass.setAmount(add3.address, 222, 501);
        } catch (error) {
            expect(error.message).to.include("BLKP: diamond max supply exceeded!");
        }
    });

    it("Test setAmount function", async() => {
        try {
            await blackPass.connect(add3).setAmount(add3.address, 3, 2);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    });
});