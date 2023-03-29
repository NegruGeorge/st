const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { expect } = require("chai");

describe.only("BlackPass setAllowedContract tests", function() {
    let blackPass, add1, add2, add3, add4, deployer, values, tree, payerAccount;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2, add3, add4] = await ethers.getSigners();
        const NFT721a = await ethers.getContractFactory("BlackPass");

        blackPass = await NFT721a.deploy("https://test/");
        await blackPass.deployed();
    });

    it("Test setAllowedContract function", async() => {
        await blackPass.setAllowedContract(add1.address, true);
        expect(await blackPass.allowedStakingPlatform(add1.address)).to.equal(true);

        await blackPass.setAllowedContract(add1.address, false);
        expect(await blackPass.allowedStakingPlatform(add1.address)).to.equal(false);
    });

    it("Test setAllowedContract function, multiple address", async() => {
        await blackPass.setAllowedContract(add1.address, true);
        expect(await blackPass.allowedStakingPlatform(add1.address)).to.equal(true);

        await blackPass.setAllowedContract(add1.address, false);
        expect(await blackPass.allowedStakingPlatform(add1.address)).to.equal(false);

        await blackPass.setAllowedContract(add2.address, true);
        expect(await blackPass.allowedStakingPlatform(add2.address)).to.equal(true);

        await blackPass.setAllowedContract(add2.address, false);
        expect(await blackPass.allowedStakingPlatform(add2.address)).to.equal(false);

        await blackPass.setAllowedContract(add3.address, true);
        expect(await blackPass.allowedStakingPlatform(add3.address)).to.equal(true);

        await blackPass.setAllowedContract(add3.address, false);
        expect(await blackPass.allowedStakingPlatform(add3.address)).to.equal(false);
    });

    it("Test setAllowedContract function", async() => {
        try {
            await blackPass.connect(add3).setAllowedContract(add3.address, false);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }
    });

});