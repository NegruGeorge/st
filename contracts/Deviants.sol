// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "erc721a/contracts/extensions/ERC721ABurnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

 /**
  * @title Deviants
  * @dev The contract allows users to convert:
  * For each Silver Mint Pass - Mint 1 Deviant 
  * For each Diamond Mint Pass- Mint 1 Deviant 
  * For each Gold Mint Pass- Mint 3 Deviants
  * For each Crimson Mint Pass- Mint 1 Deviant
  * @dev The contract also has owner who have the privilages to set the state of the contract.
  * @dev The contract use ChainLink vrf to generate random numbers.
  */
contract Deviants is ERC721A, ERC721AQueryable,ERC721ABurnable, Ownable, ReentrancyGuard, DefaultOperatorFilterer, VRFConsumerBaseV2 {
    using Strings for uint256;

    /** 
     * @dev the receiver of the passes users will convert in Deviants.
     */
    address public receiver;

    /** 
     * @dev Set max supply for the Deviants collection
     */
    uint256 public constant maxSupply = 10000;

    /** 
     * @dev request id from ChainLink VRF
     */
    uint256 public requestIdNr;

    /** 
     * @dev first random number from ChainLinkVRF
     */
    uint256 public randomNumber1;

    /** 
     * @dev second random number from ChainLinkVRF
     */
    uint256 public randomNumber2;
    
    /** 
     * @dev State of the mint => true=paused/false=unpaused
     */
    bool public pauseMint = true;

    /** 
     * @dev checks if the collection is revealed
     */
    bool public revealed = false;

    /** 
     * @dev checks if the owner requested the random numbers from ChainLinkVRF
     */
    bool public numbersRequested = false;

    /** 
     * @dev checks if ChainLink vrf returned the numbers to the Deviants contract;
     */
    bool public numbersReceived = false;

    /** 
     * @dev state to check crypto.com allocation
     */
    bool public last300On = false;

    /**
     * @dev Silver/Diamond/Gold/Crimson erc721A contracts.
     */
    ERC721A public deviantsSilverPassCollection; 
    ERC721A public deviantsDiamondPassCollection;
    ERC721A public deviantsGoldPassCollection;
    ERC721A public deviantsCrimsonPassCollection;

    /** 
     * @dev Prefix for tokens metadata URIs
     */
    string public baseURI;

    /** 
     * @dev Sufix for tokens metadata URIs
     */
    string public uriSuffix = '.json';

    /**
     * @dev unrevealed token URI
     */
    string public unrevealedURI;

    /**
     * @dev legendary unrevealed token URI
     */
    string public legendaryUnrevealedURI;

    /**
     * @dev Chainlink VRF coordinator address specific to desired chain
     */
    VRFCoordinatorV2Interface public i_vrfCoordinator;

    /**
     * @dev Chainlink VRF subscription Id created by the owner
     */
    uint64  private  i_subscriptionId;

    /**
     * @dev gasLane (keyHash) of the specific chain  
     */
    bytes32 private  i_gasLane;

    /**
     * @dev Chainlink VRF callback function limit cost
     */
    uint32 private  i_callbackGasLimit;

    /**
     * @dev How many blocks the VRF service waits before writing a fulfillment to the chain
     */
    uint16 private  REQUEST_CONFIRMATIONS = 3;

    /**
     * @dev number of random words chainLink VRF will provide
     */
    uint32 private  NUM_WORDS = 2;

    /**
     * @dev mapping with blockedMarketplaces for this contract
     */
    mapping(address => bool) public blockedMarketplaces; 

    /**
     * @dev Emits an event when an NFT is minted 
     * @param minterAddress The address of the user who executed the mint.
     * @param amount The amount of NFTs minted.
     */
    event MintDeviants(
        address indexed minterAddress,
        uint256 amount
    );

    /**
     * @dev Emits an event when owner mint a batch.
     * @param owner The addresses who is the contract owner.
     * @param addresses The addresses array.
     * @param amount The amount of NFTs minted for each address.
     */
    event MintBatch(
        address indexed owner,
        address[] addresses,
        uint256 amount
    );
    
    /**
     * @dev Constructor function that sets the initial values for the contract's variables.
     * @param uri The metadata URI prefix.
     * @param _unrevealedURI The unrevealed URI metadata
     * @param _legendaryUnrevealedURI The legendary unrevealed URI metadata
     * @param _receiver The receiver address
     * @param vrfCoordinatorV2 The ChainLink vrf coordinator address.
     * @param _deviantsSilverPassCollection Silver collection address.
     * @param _deviantsDiamondPassCollection Dimond collection address.
     * @param _deviantsGoldPassCollection Gold collection address.
     * @param _deviantsCrimsonPassCollection Crimson collection address.
     */
    constructor(
        string memory uri,
        string memory _unrevealedURI,
        string memory _legendaryUnrevealedURI,
        address _receiver,
        address vrfCoordinatorV2,
        ERC721A _deviantsSilverPassCollection,
        ERC721A _deviantsDiamondPassCollection,
        ERC721A _deviantsGoldPassCollection,
        ERC721A _deviantsCrimsonPassCollection
    )VRFConsumerBaseV2(vrfCoordinatorV2)
     ERC721A("Deviants", "DNFT") {
        baseURI = uri;
        unrevealedURI = _unrevealedURI;
        legendaryUnrevealedURI = _legendaryUnrevealedURI;
        receiver = _receiver;
        deviantsSilverPassCollection = _deviantsSilverPassCollection;
        deviantsDiamondPassCollection = _deviantsDiamondPassCollection;
        deviantsGoldPassCollection = _deviantsGoldPassCollection; 
        deviantsCrimsonPassCollection = _deviantsCrimsonPassCollection;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);

    }

    /**
     * @dev Function that initiate all the chainLink variables
     * @param subscriptionId Sets the subscriptionId
     * @param gasLane Sets the gasLane
     * @param callbackGasLimit Sets the callbackGasLimit 
     * @notice Only the contract owner can call this function.
     */
    function initChainlink(
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) external onlyOwner {
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit; 
    }

    /**
     * @dev Function that asks ChainLink VRF for random numbers
     * @notice Only the contract owner can call this function.
     */
    function askRandomNumber() external onlyOwner  {

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        numbersRequested = true;
        requestIdNr = requestId;

    }

    /**
     * @dev Fallback function called by chainlink after askRandomNumber function is called;
     * @param _requestId Id we recived when we called the askRandom function
     * @param _randomWords Array with random numbers generated by ChainLink
     */
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords ) internal override{

        require(numbersRequested == true,"DNFT: number not requested");
        require(requestIdNr != 0 , "DNFT:request error");
        randomNumber1 = _randomWords[0];
        randomNumber2 = _randomWords[1];
        numbersReceived = true;
    }

     /**
      * @dev mintDeviants converts mintPasses into Deviants NFTS.
      * @param tokenIdsSilver arrays with tokenIds from Silver collection that user wants to convert to Deviants rate 1-1
      * @param tokenIdsDiamond arrays with tokenIds from Diamond collection that user wants to convert to Deviants rate 1-1
      * @param tokenIdsGold arrays with tokenIds from Gold collection that user wants to convert to Deviants rate 1-3
      * @param tokenIdsCrimson arrays with tokenIds Crimson Silver collection that user wants to convert to Deviants rate 1-1
      * @notice Throws if:
      * - mint closed if the function is called if the contract is paused.
      * - mints exceeded if the minted amount exceeds the maxSupply.
      * - mints exceeded if the minted amount exceeds the 9700.
      */
    function mintDeviants
    (uint256[] calldata tokenIdsSilver,
     uint256[] calldata tokenIdsDiamond,
     uint256[] calldata tokenIdsGold,
     uint256[] calldata tokenIdsCrimson) external {

        require(!pauseMint, "DNFT: Mint closed");
        uint256 mintAmount = tokenIdsSilver.length + tokenIdsDiamond.length + tokenIdsCrimson.length + tokenIdsGold.length * 3;

        //Crypto.com allocation.
        if(!last300On){
            require(totalSupply() + mintAmount <= 9700, "DNFT: maxSupply exceeded for now");
        }
        require(totalSupply() + mintAmount <= maxSupply, "DNFT: maxSupply exceeded");

        for(uint256 i = 0 ; i < tokenIdsSilver.length;i++){
            deviantsSilverPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsSilver[i]);
        }
        for(uint256 i = 0 ; i < tokenIdsDiamond.length;i++){
            deviantsDiamondPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsDiamond[i]);
        }
        for(uint256 i = 0 ; i < tokenIdsGold.length;i++){
            deviantsGoldPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsGold[i]);
        }
        for(uint256 i = 0 ; i < tokenIdsCrimson.length;i++){
            deviantsCrimsonPassCollection.safeTransferFrom(msg.sender,receiver,tokenIdsCrimson[i]);
        }
        _safeMint(msg.sender,mintAmount);
        emit MintDeviants(msg.sender,mintAmount);
    }

    /**
     * @dev Function to mint a batch of NFTs to multiple addresses
     * @param addresses An array of addresses to mint NFTs to
     * @param _mintAmounts The amount of NFTs to mint to each address
     * @notice Only the contract owner can call this function.
     */
    function mintBatch(address[] memory addresses, uint256 _mintAmounts) external onlyOwner{
        require(totalSupply() + addresses.length * _mintAmounts <= maxSupply,"DNFT: maxSupply exceeded");

        for(uint256 i = 0;i < addresses.length; i++){
            _safeMint(addresses[i],_mintAmounts);
        }
        emit MintBatch(msg.sender, addresses, _mintAmounts);
    }

    /**
     * @dev This function sets the base URI of the NFT contract.
     * @param uri The new base URI of the NFT contract.
     * @notice Only the contract owner can call this function.
     */
    function setBasedURI(string memory uri) external onlyOwner{
        baseURI = uri;
    }

    /**
     * @dev Set the pause state of the contract, only the contract owner can set the pause state
     * @param state Boolean state of the pause, true means that the contract is paused, false means that the contract is not paused
     */
    function setPauseMint(bool state) external onlyOwner{
        pauseMint = state;
    }

    /**
     * @dev Sets the uriSuffix for the ERC-721A token metadata.
     * @param _uriSuffix The new uriSuffix to be set.
     */
    function setUriSuffix(string memory _uriSuffix) public onlyOwner {
        uriSuffix = _uriSuffix;
    }

    /**
     * @dev Sets the unrevealedURI for the ERC-721A token metadata.
     * @param _unrevealedURI The new _unrevealedURI to be set.
     */
    function setUnrevealedURI(string memory _unrevealedURI) public onlyOwner{
        unrevealedURI = _unrevealedURI;
    }

    /**
     * @dev Sets the legendaryUnrevealedURI for the ERC-721A token metadata.
     * @param _legendaryUnrevealedURI The new legendaryUnrevealedURI to be set.
     */
    function setLegendaryUnrevealedURI(string memory _legendaryUnrevealedURI) public onlyOwner{
        legendaryUnrevealedURI = _legendaryUnrevealedURI;
    }

    /**
     * @dev Sets the receiver.
     * @param _receiver The new receiver.
     */
    function setReceiver(address _receiver) public onlyOwner {
        receiver = _receiver;
    }

    /**
     * @dev Sets the revealed state of the contract.
     * @param state State of the revealed.
     */
    function setRevealed(bool state) public onlyOwner {
        revealed = state;
    }

    /**
     * @dev Allow users to mint the las 300 nfts
     * @param state If set to true, users can mint the tokenIDS from 9700 to 10000
     */
    function setLast300On(bool state) public onlyOwner{
        last300On = state;
    }

    /**
     * @dev blockMarketplaces from listing our nft.
     * @param marketplace marketplace address
     * @param state checks if the marketplace is blocked or not
     */
    function setBlokedMarketplaces(address marketplace, bool state) public onlyOwner{
        blockedMarketplaces[marketplace] = state;
    }

    /**
     * setters for deviantsPASS Addresses;
     */
    function setDeviantsSilverPassCollection(ERC721A _deviantsSilverPassCollection) external onlyOwner{
        deviantsSilverPassCollection = _deviantsSilverPassCollection;
    }

    function setDeviantsDiamondPassCollection(ERC721A _deviantsDiamondPassCollection) external onlyOwner{
        deviantsDiamondPassCollection = _deviantsDiamondPassCollection;
    }

    function setDeviantsGoldPassCollection(ERC721A _deviantsGoldPassCollection) external onlyOwner{
        deviantsGoldPassCollection = _deviantsGoldPassCollection;
    }

    function setDeviantsCrimsonPassCollection(ERC721A _deviantsCrimsonPassCollection) external onlyOwner{
        deviantsCrimsonPassCollection = _deviantsCrimsonPassCollection;
    }


    /**
     * @dev Returns the total amount of Deviants one user can mint (Silver + Dimond + Gold*3 + Crimson)
     */
    function getUserStatus(address holder) public view returns(uint256){
        uint256 userMintAmount = deviantsSilverPassCollection.balanceOf(holder) + deviantsDiamondPassCollection.balanceOf(holder) + deviantsCrimsonPassCollection.balanceOf(holder) + deviantsGoldPassCollection.balanceOf(holder) * 3;
        return userMintAmount;
    }

    /**
    * @dev Returns the starting token ID for the token.
    * @return uint256 The starting token ID for the token.
    */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    /**
     * @dev Returns the token URI for the given token ID. Throws if the token ID does not exist
     * @param _tokenId The token ID to retrieve the URI for
     * @notice Retrieve the URI for the given token ID
     * @return The token URI for the given token ID
     */
    function tokenURI(uint256 _tokenId) public view virtual override(ERC721A,IERC721A) returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

         if (revealed == false) {
            if(_tokenId <=15){
                return legendaryUnrevealedURI;
            }else{
                return unrevealedURI;
            }
        }
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), uriSuffix))
            : '';
    }
        
    /**
     * @dev Returns the current base URI.
     * @return The base URI of the contract.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // DefaultOperatorFilterer functions

    function setApprovalForAll(address operator, bool approved) public  override(ERC721A,IERC721A) onlyAllowedOperatorApproval(operator) {
        require(!blockedMarketplaces[operator],"DNFT: Invalid marketplace");
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperatorApproval(operator) {
        require(!blockedMarketplaces[operator],"DNFT: Invalid marketplace");
        super.approve(operator, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperator(from) {
        require(!blockedMarketplaces[to],"DNFT: Invalid marketplace");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperator(from) {
        require(!blockedMarketplaces[to],"DNFT: Invalid marketplace");
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        payable 
        override(ERC721A,IERC721A)
        onlyAllowedOperator(from)
    {
        require(!blockedMarketplaces[to],"DNFT: Invalid marketplace");
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
