// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
// const { BigNumber } = require("ethers");

// describe("Test base VRF functionality", function () {
//     let deviantsNFT, deployer, add1, add2, add3, add4, erc20, hardhatVrfCoordinatorV2Mock,payerAccount, values;
//     let deviantsCrimsonPass,deviantsDimondPass,deviantsGoldPass,deviantsSilverPass;
//     beforeEach(async () => {
//         [deployer, add1, add2, add3, add4] = await ethers.getSigners();
        
        
//         payerAccount = add3;
//         values = [
//             ["0x1805c49ae4392f1df411f665fdb5c6bd77b23d4a"],
//             ["0x9c480cd02d8a2ae18de1c6ac96c8fa41c396b146"],
//             ["0xee2c99d8d6acb7940609fd6a9c5ba2129fa43004"],
//             ["0x2dad87948265fb9a64f1532fe6d0bff12dfbeed1"],
//             [add2.address],
//             [add3.address]
//         ]
        
//         // deploy ERC721
//         const NFT721aSilver = await ethers.getContractFactory("DeviantsSilverPass");
//         const NFT721aGold = await ethers.getContractFactory("DeviantsMintPass");
//         const NFT721aDimond = await ethers.getContractFactory("DeviantsMintPassDiamond");
//         const NFT721aCrimson = await ethers.getContractFactory("DeviantsCrimsonPass");

//         tree = StandardMerkleTree.of(values, ["address"]);

//         deviantsSilverPass = await NFT721aSilver.deploy(tree.root, "https://test/", payerAccount.address);
//         await deviantsSilverPass.deployed();
//         deviantsDimondPass = await NFT721aDimond.deploy(payerAccount.address);
//         await deviantsDimondPass.deployed();
//         deviantsGoldPass = await NFT721aGold.deploy(payerAccount.address);
//         await deviantsGoldPass.deployed();
//         deviantsCrimsonPass = await NFT721aCrimson.deploy(tree.root, "https://test/", payerAccount.address, deviantsSilverPass.address, deviantsDimondPass.address, deviantsGoldPass.address);
//         await deviantsCrimsonPass.deployed();

//         await deviantsSilverPass.mintBatch([deployer.address], 10)
//         // await deviantsDimondPass.gift([deployer.address.toString()], ["12"])
//         await deviantsGoldPass.gift([deployer.address], [1])
            
        
        
        
//         // let DeviantsNFT = await ethers.getContractFactory("Deviants");
//         // let vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");

//         // hardhatVrfCoordinatorV2Mock = await vrfCoordinatorV2Mock.deploy(0, 0);

//         // await hardhatVrfCoordinatorV2Mock.createSubscription();

//         // // subscription ID = 1; 
//         // await hardhatVrfCoordinatorV2Mock.fundSubscription(1, ethers.utils.parseEther("7"))

//         // deviantsNFT = await DeviantsNFT.deploy(
//         // "testURI", 
//         // "unrevealedURI",
//         // "legendaryunrevealedURI",
//         // add3.address,
//         // hardhatVrfCoordinatorV2Mock.address,
//         // deviantsSilverPass.address,
//         // deviantsDimondPass.address,
//         // deviantsGoldPass.address,
//         // deviantsCrimsonPass.address
//         // );

//         // await deviantsNFT.deployed();    


//     })

//     it("Contract should try to get the 2 random numbers", async () => {
//         // await deviantsNFT.initChainlink(1,ethers.utils.formatBytes32String(""),2500000);
//         // await hardhatVrfCoordinatorV2Mock.addConsumer(1, deviantsNFT.address)

//         expect(await deviantsNFT.numbersRequested()).to.eq(false);
//         await deviantsNFT.askRandomNumber().then(res=>{
//             assert.fail("must throw err");
//         }).catch(err=>{
//             expect(err.message).to.contain("InvalidConsumer()")
//         })       
//         expect(await deviantsNFT.numbersRequested()).to.eq(false);

//     });

//     it("Contract should try to get the random numbers but consumer is not initialized", async () => {
//         await deviantsNFT.initChainlink(1,ethers.utils.formatBytes32String(""),250000);
//         // await hardhatVrfCoordinatorV2Mock.addConsumer(1, deviantsNFT.address)

//         expect(await deviantsNFT.numbersRequested()).to.eq(false);
//         await deviantsNFT.askRandomNumber().then(res=>{
//             assert.fail("must throw err");
//         }).catch(err=>{
//             expect(err.message).to.contain("InvalidConsumer()")
//         })
//         expect(await deviantsNFT.numbersRequested()).to.eq(false);

//     });

//     it("Coordinator should successfully receive the request", async function () {

//         await deviantsNFT.initChainlink(1,ethers.utils.formatBytes32String(""),250000);
//         await hardhatVrfCoordinatorV2Mock.addConsumer(1, deviantsNFT.address)

//         expect(await deviantsNFT.numbersRequested()).to.eq(false);
//         expect(await deviantsNFT.numbersReceived()).to.eq(false);

//         expect(await deviantsNFT.requestIdNr()).to.eq(0)

//         await expect(deviantsNFT.askRandomNumber()).to.emit(
//             hardhatVrfCoordinatorV2Mock,
//             "RandomWordsRequested"
//           );
      
//         expect(await deviantsNFT.numbersRequested()).to.eq(true);
//         expect(await deviantsNFT.numbersReceived()).to.eq(false);


//     })

//     it("Contract should receive Random Numbers", async () => { 

//         await deviantsNFT.initChainlink(1,ethers.utils.formatBytes32String(""),250000);
//         await hardhatVrfCoordinatorV2Mock.addConsumer(1, deviantsNFT.address)

//         expect(await deviantsNFT.numbersRequested()).to.eq(false);
//         expect(await deviantsNFT.numbersReceived()).to.eq(false);
//         expect(await deviantsNFT.requestIdNr()).to.eq(0)

//         let tx = await deviantsNFT.askRandomNumber();
//         let {events} = await tx.wait();

//         await expect(
//             hardhatVrfCoordinatorV2Mock.fulfillRandomWords(1, deviantsNFT.address)
//           ).to.emit(hardhatVrfCoordinatorV2Mock, "RandomWordsFulfilled")
        
        
//           expect(await deviantsNFT.numbersRequested()).to.eq(true);
//           expect(await deviantsNFT.numbersReceived()).to.eq(true);
//           expect(await deviantsNFT.randomNumber1()).to.not.eq(0);
//     });


// })