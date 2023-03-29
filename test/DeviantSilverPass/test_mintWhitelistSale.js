const { expect, assert } = require("chai");
const { abi: DeviantSilverPassABI } = require("../../artifacts/contracts/DeviantsSilverPass.sol/DeviantsSilverPass.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { ethers } = require("hardhat");
const { TASK_COMPILE_SOLIDITY_COMPILE } = require("hardhat/builtin-tasks/task-names");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
let globalTimestamp = 1675788635
describe("DeviantsSilverPass mintWhitelistSale tests", function() {
    let deviantsSilverPass, add1, add2, deployer, values, tree, payerAccount
    let interactionDeviantSilverPassAdd1, interactionDeviantSilverPassAdd2;

    beforeEach("Set enviroment for tests", async() => {
        [deployer, add1, add2, payerAccount] = await ethers.getSigners();
        // deploy PGERC721
        const NFT721a = await ethers.getContractFactory("DeviantsSilverPass");

        values = [
            ["0x1805c49ae4392f1df411f665fdb5c6bd77b23d4a"],
            ["0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146"],
            ["0xee2c99d8d6acb7940609fd6a9c5ba2129fa43004"],
            ["0x2dad87948265fb9a64f1532fe6d0bff12dfbeed1"],
            [add1.address],
            [add2.address]
        ]

        tree = StandardMerkleTree.of(values, ["address"]);

        deviantsSilverPass = await NFT721a.deploy(tree.root, "https://test/", payerAccount.address);
        await deviantsSilverPass.deployed();

        interactionDeviantSilverPassAdd1 = new ethers.Contract(deviantsSilverPass.address, DeviantSilverPassABI, add1);
        interactionDeviantSilverPassAdd2 = new ethers.Contract(deviantsSilverPass.address, DeviantSilverPassABI, add2);
    });

    it("Mint one nft", async() => {
        await time.setNextBlockTimestamp(1775788635);
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])
        console.log(add1.address)
        console.log(proof)
            //Check getter
        expect(await deviantsSilverPass.getWhitelistSaleStatus()).to.equal(true)

        await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        expect(await deviantsSilverPass.ownerOf(1)).to.equal(add1.address);
        globalTimestamp += 2;
    });

    it("Mint two nfts and withdraw as a payerAccount", async() => {
        await time.setNextBlockTimestamp(globalTimestamp);
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])

        try {
            await deviantsSilverPass.connect(payerAccount).withdraw();
        } catch (error) {
            expect(error.message).to.include("DMPS: contract balance is zero");
        }

        await interactionDeviantSilverPassAdd1.mintWhitelistSale(2, proof, { value: ethers.utils.parseEther("0.0035") });
        expect(await deviantsSilverPass.ownerOf(1)).to.equal(add1.address);
        expect(await deviantsSilverPass.ownerOf(2)).to.equal(add1.address);
        await deviantsSilverPass.connect(payerAccount).withdraw();
        globalTimestamp += 4;
    });

    it("Mint second nft if already have one", async() => {
        await time.setNextBlockTimestamp(globalTimestamp);
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])

        //Mint first nft
        await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        expect(await deviantsSilverPass.ownerOf(1)).to.equal(add1.address);
        globalTimestamp += 2;
        try {
            await deviantsSilverPass.withdraw();
        } catch (error) {
            expect(error.message).to.include("DMPS: contract balance is zero")
        }
        globalTimestamp++;
        //Mint second nft
        await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof, { value: ethers.utils.parseEther("0.0035") });
        expect(await deviantsSilverPass.ownerOf(2)).to.equal(add1.address);

        //try to withdraw as a normal user
        try {
            await deviantsSilverPass.connect(add1).withdraw();
        } catch (error) {
            expect(error.message).to.include("DMPS: can be called only with the owner or payerAccount");
        }
        globalTimestamp += 5;

        await deviantsSilverPass.withdraw();
        //Test total supply already minted
        let totalSupplyAlreadyMinted = await deviantsSilverPass.totalSupply();
        expect(totalSupplyAlreadyMinted).to.equal(2);
    });

    it("Try to mint whit amoun != 1 or amount !=2", async() => {
        await time.setNextBlockTimestamp(globalTimestamp)
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])
        globalTimestamp += 5;
        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(11, proof);
        } catch (error) {
            expect(error.message).to.include("DMPS: mintAmount must be 1 or 2");
        }

        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(0, proof);
        } catch (error) {
            expect(error.message).to.include("DMPS: mintAmount must be 1 or 2");
        }

        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(100, proof);
        } catch (error) {
            expect(error.message).to.include("DMPS: mintAmount must be 1 or 2");
        }
        globalTimestamp += 5;
    });

    it("Try to mint more than 2 nft for one address", async() => {
        await time.setNextBlockTimestamp(globalTimestamp)
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])
        globalTimestamp += 2;
        //Mint first nft
        await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        expect(await deviantsSilverPass.ownerOf(1)).to.equal(add1.address);

        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(2, proof, { value: ethers.utils.parseEther("0.0035") });
        } catch (error) {
            expect(error.message).to.include("DMPS: user cannot mint more then 2 NFTs");
        }
        globalTimestamp += 2;
        let proofAddress2 = tree.getProof([add2.address])
        await interactionDeviantSilverPassAdd2.mintWhitelistSale(2, proofAddress2, { value: ethers.utils.parseEther("0.0035") });
        expect(await deviantsSilverPass.ownerOf(2)).to.equal(add2.address);
        expect(await deviantsSilverPass.ownerOf(3)).to.equal(add2.address);
        globalTimestamp++;
    });

    it("Try to mint with invalid markle proof", async() => {
        await hre.ethers.provider.send("evm_mine", [globalTimestamp])
        let localValues = [
            ["0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146"],
            ["0xee2c99d8d6acb7940609fd6a9c5ba2129fa43004"],
            [add1.address],
            [add2.address]
        ]

        let localTree = StandardMerkleTree.of(localValues, ["address"]);
        let proof = localTree.getProof([add1.address]);

        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        } catch (error) {
            expect(error.message).to.include("DMPS: Invalid proof");
        }
        globalTimestamp += 3;
    });

    it("Try to mint with incorrect price", async() => {
        await hre.ethers.provider.send("evm_mine", [globalTimestamp])
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])
        let proofAdd2 = tree.getProof([add2.address])

        //Mint first nft
        await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        expect(await deviantsSilverPass.ownerOf(1)).to.equal(add1.address);
        globalTimestamp++;
        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof, { value: ethers.utils.parseEther("0.00135") });
        } catch (error) {
            expect(error.message).to.include("DMPS: user must send the exact price");
        }

        try {
            await interactionDeviantSilverPassAdd2.mintWhitelistSale(2, proofAdd2, { value: ethers.utils.parseEther("0.00135") });
        } catch (error) {
            expect(error.message).to.include("DMPS: user must send the exact price");
        }
        globalTimestamp += 5;
    });

    it("Try to mint when whitelist period is closed but we set pause", async() => {
        await hre.ethers.provider.send("evm_mine", [globalTimestamp])
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])

        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        } catch (error) {
            expect(error.message).to.include("DMPS: mintAmount must be 1 or 2")
        }
        globalTimestamp++;
        //try to set pause as a normal user
        try {
            await deviantsSilverPass.connect(add1).setPauseWLSale(false);
        } catch (error) {
            expect(error.message).to.include("Ownable: caller is not the owner");
        }

        await deviantsSilverPass.setPauseWLSale(false);
        await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof, { value: ethers.utils.parseEther("0.0035") });
        globalTimestamp++;
    });

    it("Try to mint when whitelist period is over", async() => {
        await hre.ethers.provider.send("evm_mine", [1675872060])
        let tree = StandardMerkleTree.of(values, ["address"]);
        let proof = tree.getProof([add1.address])

        try {
            await interactionDeviantSilverPassAdd1.mintWhitelistSale(1, proof);
        } catch (error) {
            expect(error.message).to.include("DMPS: whitelistSale closed")
        }
        globalTimestamp++;
    });

})