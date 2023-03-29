const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass tokenURI tests", function() {
    let blackPass, add1, add2, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2] = await ethers.getSigners();
        const NFT721a = await ethers.getContractFactory("BlackPass");

        blackPass = await NFT721a.deploy("https://test/");
        await blackPass.deployed();
    });

    it("Test tokenURI ", async() => {
        try {
            await blackPass.tokenURI(1);
        } catch (error) {
            expect(error.message).to.include("ERC721Metadata: URI query for nonexistent token");
        }
    });

    it("Test tokenURI with metadata already set", async() => {
        await blackPass.setBasedURI("metadata");
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        expect(await blackPass.tokenURI(1)).to.equal("metadata1.json")
    });

    it("Test tokenURI function withou uri", async() => {
        await blackPass.setBasedURI("");
        await blackPass.setAmount(add1.address, 3, 3);
        await blackPass.setPauseMint(false);
        await blackPass.connect(add1).mint();
        expect(await blackPass.tokenURI(1)).to.equal("")
    });

});