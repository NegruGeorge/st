const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass setBaseURI tests", function() {
    let blackPass, add1, add2, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2] = await ethers.getSigners();
        const NFT721a = await ethers.getContractFactory("BlackPass");

        blackPass = await NFT721a.deploy("https://test/");
        await blackPass.deployed();
    });

    it("Test setBaseURI", async() => {
        let newURI = "newURI"
        let oldURI = await blackPass.baseURI();
        await blackPass.setBasedURI(newURI);
        expect(await blackPass.baseURI()).to.equal(newURI);
        expect(oldURI).not.equal(await blackPass.baseURI())
    });

    it("Test setBaseURI as a normal user", async() => {
        let newURI = "newURI"
        let oldURI = await blackPass.baseURI();
        await blackPass.setBasedURI(newURI);
        expect(await blackPass.baseURI()).to.equal(newURI);
        expect(oldURI).not.equal(await blackPass.baseURI())

        let newURIUser = "userTryToSet"
        try {
            await blackPass.connect(add1).setBasedURI(newURIUser);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    });

});