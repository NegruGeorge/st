const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass setUriSuffix tests", function() {
    let blackPass, add1, add2, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2] = await ethers.getSigners();
        const NFT721a = await ethers.getContractFactory("BlackPass");

        blackPass = await NFT721a.deploy("https://test/");
        await blackPass.deployed();
    });

    it("Test setUriSuffix", async() => {
        let newURI = ".js"
        let oldURI = await blackPass.uriSuffix();
        await blackPass.setUriSuffix(newURI);
        expect(await blackPass.uriSuffix()).to.equal(newURI);
        expect(oldURI).not.equal(await blackPass.uriSuffix())
    });

    it("Try set suffix as a normal user", async() => {
        let newURI = ".js"
        try {
            await blackPass.connect(add1).setUriSuffix(newURI);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    });

});