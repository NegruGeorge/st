// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;

// import "erc721a/contracts/ERC721A.sol";
// import "erc721a/contracts/extensions/ERC721AQueryable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
// import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// import "hardhat/console.sol";

//  /**
//   * @title Deviants
//   * @dev The contract allows users to mint:
//   * For each Silver Mint Pass - Mint 2 crimson pass
//   * For each Diamond Mint Pass- Mint 3 crimson pass
//   * For each Gold Mint Pass- Mint 4 crimson pass
//   * @dev The contract has 2 phases, Phase1 sale and Phase2.
//   * @dev The contract uses a Merkle proof to validate that an address is whitelisted.
//   * @dev The contract also has an owner who have the privilages to set the state of the contract and withdraw erc20 native tokens.
//   */
// contract DeviantsV1 is ERC721A, ERC721AQueryable, Ownable, ReentrancyGuard, DefaultOperatorFilterer, VRFConsumerBaseV2 {
//     using Strings for uint256;

//     address public receiver;

//     /** 
//      * @dev Set max supply for the Deviants collection
//      */
//     uint256 public constant maxSupply = 10000;

//     uint256[10000] private mintArray;

//     /** 
//      * @dev Set whitelist mintPhase1 period and public mintPhase2 period
//      */
//     uint256 public constant startMint = 1677330000;
//     uint256 public constant endMint = 1677416400;

//     uint256 public requestIdNr;

//     uint256 private randomNumber;
    

//     /** 
//      * @dev A boolean that indicates whether the contract isindicates is paused or not.
//      */
//     bool public pauseMint = false;

//     bool public revealed = false;

//     bool public numberRequested = false;
//     bool public numberSet = false;
//     bool public arraySuffled = false;
//     bool public last300On = false;

//     /**
//      * @dev Define three ERC721A contracts 
//      */
//     ERC721A public deviantsSilverPassCollection; 
//     ERC721A public deviantsDiamondPassCollection;
//     ERC721A public deviantsGoldPassCollection;
//     ERC721A public deviantsCrimsonPassCollection;

//     /** 
//      * @dev Prefix for tokens metadata URIs
//      */
//     string public baseURI;

//     /** 
//      * @dev Sufix for tokens metadata URIs
//      */
//     string public uriSuffix = '.json';

//     string public unrevealedURI;


//     // Chainlink VRF Variables
//     VRFCoordinatorV2Interface private i_vrfCoordinator;
//     uint64  private  i_subscriptionId;
//     bytes32 private  i_gasLane;
//     uint32 private  i_callbackGasLimit;

//     /// @dev How many blocks the VRF service waits before writing a fulfillment to the chain
//     /// @dev The default is 3, it can be set higher.
//     uint16 private  REQUEST_CONFIRMATIONS = 3;
//     uint32 private  NUM_WORDS = 1;


//     /**
//      * @dev Emits an event when an NFT is minted in Phase1 period.
//      * @param minterAddress The address of the user who executed the mint.
//      * @param amount The amount of NFTs minted.
//      */
//     event MintDeviants(
//         address indexed minterAddress,
//         uint256 amount
//     );

//     /**
//      * @dev Emits an event when owner mint a batch.
//      * @param owner The addresses who is the contract owner.
//      * @param addresses The addresses array.
//      * @param amount The amount of NFTs minted for each address.
//      */
//     event MintBatch(
//         address indexed owner,
//         address[] addresses,
//         uint256 amount
//     );
    
//     /**
//      * @dev Emits an event when owner mint a batch.
//      * @param owner The addresses who is the contract owner.
//      * @param amount The amount of native tokens withdrawn.
//      */
//     event Withdraw(
//         address indexed owner,
//         uint256 amount
//     );

//     /**
//      * @dev Constructor function that sets the initial values for the contract's variables.
//      * @param _baseURI The metadata URI prefix.
//      * @param _deviantsSilverPassCollection Silver collection address.
//      * @param _deviantsDiamondPassCollection Dimond collection address.
//      * @param _deviantsGoldPassCollection Gold collection address.
//      */
//     constructor(
//         string  memory _baseURI,
//         string  memory _unrevealedURI,
//         address _receiver,
//         address vrfCoordinatorV2,
//         ERC721A _deviantsSilverPassCollection,
//         ERC721A _deviantsDiamondPassCollection,
//         ERC721A _deviantsGoldPassCollection,
//         ERC721A _deviantsCrimsonPassCollection
//     )VRFConsumerBaseV2(vrfCoordinatorV2)
//      ERC721A("Deviants", "DNFT") {
//         baseURI = _baseURI;
//         unrevealedURI = _unrevealedURI;
//         receiver = receiver;
//         deviantsSilverPassCollection = _deviantsSilverPassCollection;
//         deviantsDiamondPassCollection = _deviantsDiamondPassCollection;
//         deviantsGoldPassCollection = _deviantsGoldPassCollection; 
//         deviantsCrimsonPassCollection = _deviantsCrimsonPassCollection;
//         i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);

//     }

//     function initChainlink(
//         uint64 subscriptionId,
//         bytes32 gasLane,
//         uint32 callbackGasLimit
//     ) external onlyOwner {
//         i_subscriptionId = subscriptionId;
//         i_gasLane = gasLane;
//         i_callbackGasLimit = callbackGasLimit; 
//     }

//     function initializeRandomArray() external onlyOwner  {

//         uint256 requestId = i_vrfCoordinator.requestRandomWords(
//             i_gasLane,
//             i_subscriptionId,
//             REQUEST_CONFIRMATIONS,
//             i_callbackGasLimit,
//             NUM_WORDS
//         );

//         numberRequested = true;
//         requestIdNr = requestId;
//         uint256 startIndex = 758;
//         for(uint256 i=startIndex;i<=mintArray.length;i++){
//             mintArray[i] = i;
//         }
//         console.log("finalize array ");
//     }

//     // called by the chainlink after the initializeRandomArray is called;
//     function fulfillRandomWords(
//         uint256 _requestId,
//         uint256[] memory _randomWords ) internal override{
//         console.log("here in full");
//         require(numberRequested == true,"DNFT: number not requested");
//         require(requestIdNr != 0 , "DNFT:request error");
//         randomNumber = _randomWords[0];
//         numberSet = true;
//     }


//     function shuffleArray() external onlyOwner{
//         uint256 startGas = gasleft();
//         console.log(startGas);
//         require(randomNumber !=0,"DNFT: RequestNumber not initialized");
//         uint256 startIndex = 758;
//         uint256 encode = uint256(keccak256(abi.encodePacked(randomNumber))); 
//         for (uint256 i = startIndex; i < mintArray.length; i++) {
//             uint256 n = i +  encode % (mintArray.length - i);
//             uint256 temp = mintArray[n];
//             mintArray[n] = mintArray[i];
//             mintArray[i] = temp;
//         }
        
//         arraySuffled = true;
//         console.log(gasleft());
//     }


//     function mintDeviants
//     (uint256[] calldata tokenIdsSilver,
//      uint256[] calldata tokenIdsDiamond,
//      uint256[] calldata tokenIdsGold,
//      uint256[] calldata tokenIdsCrimson) external {

//         require(!pauseMint, "DNFT: Mint closed");

//         uint256 mintAmount = tokenIdsSilver.length + tokenIdsDiamond.length + tokenIdsCrimson.length + tokenIdsGold.length * 3;

//         //Crypto.com allocation.
//         //setter for this
//         if(!last300On){
//             require(totalSupply() + mintAmount <= 9700, "DNFT: maxSupply exceeded for now");
//         }

//         require(totalSupply() + mintAmount <= maxSupply, "DNFT: maxSupply exceeded");

//         for(uint256 i = 0 ; i < tokenIdsSilver.length;i++){
//             deviantsSilverPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsSilver[i]);
//         }
//         for(uint256 i = 0 ; i < tokenIdsDiamond.length;i++){
//             deviantsDiamondPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsDiamond[i]);
//         }
//         for(uint256 i = 0 ; i < tokenIdsGold.length;i++){
//             deviantsGoldPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsGold[i]);
//         }
//         for(uint256 i = 0 ; i < tokenIdsCrimson.length;i++){
//             deviantsCrimsonPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsCrimson[i]);
//         }
//         _safeMint(msg.sender,mintAmount);
//     }

//     /**
//      * @dev Function to mint a batch of NFTs to multiple addresses
//      * @param addresses An array of addresses to mint NFTs to
//      * @param _mintAmounts The amount of NFTs to mint to each address
//      * @notice Only the contract owner can call this function.
//      */
//     function mintBatch(address[] memory addresses, uint256 _mintAmounts) external onlyOwner{
//         require(totalSupply() + addresses.length * _mintAmounts <= maxSupply,"DNFT: maxSupply exceeded");

//         for(uint256 i = 0;i < addresses.length; i++){
//             _safeMint(addresses[i],_mintAmounts);
//         }
//         emit MintBatch(msg.sender, addresses, _mintAmounts);
//     }

//     /**
//      * @dev This function sets the base URI of the NFT contract.
//      * @param _baseURI The new base URI of the NFT contract.
//      * @notice Only the contract owner can call this function.
//      */
//     function setBasedURI(string memory _baseURI) external onlyOwner{
//         baseURI = _baseURI;
//     }

//     /**
//      * @dev Set the global pause state of the contract, only the contract owner can set the pause state
//      * @param state Boolean state of the pause, true means that the contract is paused, false means that the contract is not paused
//      */
//     function setPauseMint(bool state) external onlyOwner{
//         pauseMint = state;
//     }

//     /**
//      * @dev Sets the uriSuffix for the ERC-721 token metadata.
//      * @param _uriSuffix The new uriSuffix to be set.
//      */
//     function setUriSuffix(string memory _uriSuffix) public onlyOwner {
//         uriSuffix = _uriSuffix;
//     }

//     function setUnrevealedURI(string memory _unrevealedURI) public onlyOwner{
//         unrevealedURI = _unrevealedURI;
//     }

//     /**
//      * @dev Sets the receiver.
//      * @param _receiver The new receiver.
//      */
//     function setReceiver(address _receiver) public onlyOwner {
//         receiver = _receiver;
//     }

//     function setRevealed(bool state) public onlyOwner {
//         revealed = state;
//     }

//     function setLast300On(bool state) public onlyOwner{
//         last300On = state;
//     }

//     /**
//      * setters for deviantsPASS Addresses;
//      */
//     function setDeviantsSilverPassCollection(ERC721A _deviantsSilverPassCollection) external onlyOwner{
//         deviantsSilverPassCollection = _deviantsSilverPassCollection;
//     }

//     function setDeviantsDiamondPassCollection(ERC721A _deviantsDiamondPassCollection) external onlyOwner{
//         deviantsDiamondPassCollection = _deviantsDiamondPassCollection;
//     }

//     function setDeviantsGoldPassCollection(ERC721A _deviantsGoldPassCollection) external onlyOwner{
//         deviantsGoldPassCollection = _deviantsGoldPassCollection;
//     }

//     function setDeviantsCrimsonPassCollection(ERC721A _deviantsCrimsonPassCollection) external onlyOwner{
//         deviantsCrimsonPassCollection = _deviantsCrimsonPassCollection;
//     }


//     /**
//      * @dev Returns total balance returns the total balance of nfts held(Silver + Dimond + Gold)
//      */

//     function getUserStatus(address holder) public view returns(uint256){
//         uint256 userMintAmount = deviantsSilverPassCollection.balanceOf(holder) + deviantsDiamondPassCollection.balanceOf(holder) + deviantsCrimsonPassCollection.balanceOf(holder) + deviantsGoldPassCollection.balanceOf(holder) * 3;
//         return userMintAmount;
//     }

//     /**
//     * @dev Returns the starting token ID for the token.
//     * @return uint256 The starting token ID for the token.
//     */
//     function _startTokenId() internal view virtual override returns (uint256) {
//         return 1;
//     }

//     /**
//      * @dev Returns the token URI for the given token ID. Throws if the token ID does not exist
//      * @param _tokenId The token ID to retrieve the URI for
//      * @notice Retrieve the URI for the given token ID
//      * @return The token URI for the given token ID
//      */
//     function tokenURI(uint256 _tokenId) public view virtual override(ERC721A,IERC721A) returns (string memory) {
//         require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

//          if (revealed == false) {
//             return unrevealedURI;
//         }
//         //1-15 -legendary preRevealed

//         string memory currentBaseURI = _baseURI();

//         // if for the team then normal tokenId if not we return from the chainlinkVRF link;
//         if(_tokenId <758){
//             return bytes(currentBaseURI).length > 0
//             ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), uriSuffix))
//             : '';
//         }
//         else{
//             return bytes(currentBaseURI).length > 0
//             ? string(abi.encodePacked(currentBaseURI, mintArray[_tokenId].toString(), uriSuffix))
//             : '';
//         }

//     }
        
//     /**
//      * @dev Returns the current base URI.
//      * @return The base URI of the contract.
//      */
//     function _baseURI() internal view virtual override returns (string memory) {
//         return baseURI;
//     }

//     function setApprovalForAll(address operator, bool approved) public  override(ERC721A,IERC721A) onlyAllowedOperatorApproval(operator) {
//         super.setApprovalForAll(operator, approved);
//     }

//     function approve(address operator, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperatorApproval(operator) {
//         super.approve(operator, tokenId);
//     }

//     function transferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperator(from) {
//         super.transferFrom(from, to, tokenId);
//     }

//     function safeTransferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperator(from) {
//         super.safeTransferFrom(from, to, tokenId);
//     }

//     function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
//         public
//         payable 
//         override(ERC721A,IERC721A)
//         onlyAllowedOperator(from)
//     {
//         super.safeTransferFrom(from, to, tokenId, data);
//     }


// }
