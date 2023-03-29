// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

 /**
  * @title DeviantsCrimsonPass
  * @dev The contract allows users to mint:
  * For each Silver Mint Pass - Mint 2 crimson pass
  * For each Diamond Mint Pass- Mint 3 crimson pass
  * For each Gold Mint Pass- Mint 4 crimson pass
  * @dev The contract has 2 phases, Phase1 sale and Phase2.
  * @dev The contract uses a Merkle proof to validate that an address is whitelisted.
  * @dev The contract also has an owner who have the privilages to set the state of the contract and withdraw erc20 native tokens.
  */
contract DeviantsCrimsonPass is ERC721A, ERC721AQueryable, Ownable, ReentrancyGuard, DefaultOperatorFilterer {
    using Strings for uint256;

    /** 
     * @dev Set max supply for the DeviantsCrimsonPass collection
     */
    uint256 public constant maxSupply = 2222;

    /** 
     * @dev Set max amount of NFTs per address for wihitelist and waitlist address
     */
    uint256 public constant maxMintPerWLWallet = 2;

    /** 
     * @dev Set cost for NFT minted 
     */
    uint256 public constant price = 0.004 ether;

    /** 
     * @dev Set whitelist mintPhase1 period and public mintPhase2 period
     */
    uint256 public constant startPhase1 = 1677330000;
    uint256 public constant endPhase1 = 1677416400;
    uint256 public constant startPhase2 = 1677416401;
    uint256 public constant endPhase2 = 1677459601;

    /** 
     * @dev A boolean that indicates whether the MintPhase1 function is paused or not.
     */
    bool public pausePhase1 = true;

    /** 
     * @dev A boolean that indicates whether the MintPhase2 function is paused or not.
     */
    bool public pausePhase2 = true;

    /** 
     * @dev A boolean that indicates whether the contract isindicates is paused or not.
     */
    bool public globalPause = false;

    /**
     * @dev The root of the Merkle tree that is used for whitelist check.
     */
    bytes32 public merkleRoot;

    /**
     * @dev The account that recive the money from the mints.
     */
    address public payerAccount;


    /**
     * @dev Define three ERC721A contracts 
     */
    ERC721A public deviantsSilverPassCollection; 
    ERC721A public deviantsDiamondPassCollection;
    ERC721A public deviantsGoldPassCollection;
    
    /** 
     * @dev Prefix for tokens metadata URIs
     */
    string public baseURI;

    /** 
     * @dev Sufix for tokens metadata URIs
     */
    string public uriSuffix = '.json';

    /**
     * @dev A mapping that stores if the user minted a crimson or not.
     */
    mapping(address => uint256) public addressWLMintedAmount;

    /**
     * @dev A mapping that stores how many nfts did the user minted through those held
     */
    mapping(address => uint256) public holderMintedAmount;

    /**
     * @dev Emits an event when an NFT is minted in Phase1 period.
     * @param minterAddress The address of the user who executed the mint.
     * @param amount The amount of NFTs minted.
     */
    event MintPhase1(
        address indexed minterAddress,
        uint256 amount
    );

    /**
     * @dev Emits an event when an NFT is minted in Phase2 period.
     * @param minterAddress The address of the user who executed the mint.
     * @param amount The amount of NFTs minted.
     */
    event MintPhase2(
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
     * @dev Emits an event when owner mint a batch.
     * @param owner The addresses who is the contract owner.
     * @param amount The amount of native tokens withdrawn.
     */
    event Withdraw(
        address indexed owner,
        uint256 amount
    );

    /**
     * @dev Constructor function that sets the initial values for the contract's variables.
     * @param _merkleRoot The root of the Merkle tree.
     * @param uri The metadata URI prefix.
     * @param _payerAccount The account that can withdraw funds from the contract.
     * @param _deviantsSilverPassCollection Silver collection address.
     * @param _deviantsDiamondPassCollection Dimond collection address.
     * @param _deviantsGoldPassCollection Gold collection address.
     */
    constructor(
        bytes32 _merkleRoot,
        string  memory uri,
        address _payerAccount,
        ERC721A _deviantsSilverPassCollection,
        ERC721A _deviantsDiamondPassCollection,
        ERC721A _deviantsGoldPassCollection
    ) ERC721A("Deviants Crimson Mint Pass", "DMPC") {
        merkleRoot = _merkleRoot;
        baseURI = uri;
        payerAccount = _payerAccount;
        deviantsSilverPassCollection = _deviantsSilverPassCollection;
        deviantsDiamondPassCollection = _deviantsDiamondPassCollection;
        deviantsGoldPassCollection = _deviantsGoldPassCollection; 
    }

    /**
      * @dev mintPhase1 creates NFT tokens for for users who own NFTs from previous collections or are on whitelist.
      * @param _mintAmount the amount of NFT tokens to mint.
      * @param _merkleProof the proof of user's whitelist status.
      * @notice Throws if:
      * - mintPhase1 closed if the function is called outside of the mintPhase1 period or if the contract is paused.
      * - maxSupply exceeded if the minted amount exceeds the maxSupply.
      * - the amount of nfts that the user can mint is determined by the number of nfts held from previous collections and if it is on the whitelist
      * - user must send the exact price.
      */
    function mintPhase1(uint256 _mintAmount,bytes32[] calldata _merkleProof) external payable nonReentrant{
        require(!globalPause,"DMPC: contract is paused");
        require((block.timestamp >= startPhase1 && block.timestamp <= endPhase1 ) || !pausePhase1, "DMPC: Phase1 closed");
        require(totalSupply() + _mintAmount <= maxSupply, "DMPC: maxSupply exceeded");
        require(_mintAmount > 0 , "DMPC: cannot mint 0");
        require(msg.value == price * _mintAmount,"DMPC: user must send the exact price");

        uint256 maxCrimsonMintAmount = deviantsSilverPassCollection.balanceOf(msg.sender) * 2 + deviantsDiamondPassCollection.balanceOf(msg.sender) * 3 + deviantsGoldPassCollection.balanceOf(msg.sender) * 4;
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender))));
        bool eligibleWL = MerkleProof.verify(_merkleProof, merkleRoot, leaf);

        if(maxCrimsonMintAmount>0 && eligibleWL==false){
            require(holderMintedAmount[msg.sender] + _mintAmount <= maxCrimsonMintAmount,"DMPC: user already minted more than Hold amount"); 

            holderMintedAmount[msg.sender] +=_mintAmount;
            _safeMint(msg.sender,_mintAmount);
        }
        else if(maxCrimsonMintAmount>0 && eligibleWL){
            require(holderMintedAmount[msg.sender] + addressWLMintedAmount[msg.sender] + _mintAmount <= maxCrimsonMintAmount + maxMintPerWLWallet,"DMPC: user already minted more than Hold amount + WL alocation"); 
            uint256 holderLeft = maxCrimsonMintAmount - holderMintedAmount[msg.sender];

            if(_mintAmount <= holderLeft){
                holderMintedAmount[msg.sender] += _mintAmount;

                _safeMint(msg.sender,_mintAmount);
            } else {
                holderMintedAmount[msg.sender] += holderLeft;
                addressWLMintedAmount[msg.sender] += (_mintAmount - holderLeft);

                _safeMint(msg.sender,_mintAmount);
            }
         
        } else if(eligibleWL){
            require(addressWLMintedAmount[msg.sender] + _mintAmount <=maxMintPerWLWallet,"DMPC: user already minted more than WL amount");
            addressWLMintedAmount[msg.sender] += _mintAmount; 
            
            _safeMint(msg.sender,_mintAmount);
        }

        else revert("DMPC: user not a holder or on WL");

        emit MintPhase1(msg.sender, _mintAmount);      
    } 

    /**
     * @dev Mints NFTs in the mintPhase2
     * @param _mintAmount The number of NFTs to mint (1 or 2).
     * @param _merkleProof the proof of user's whitelist status.
     * @notice Throws if:
     * - mintPhase2 period has ended or the contract is paused.
     * - The maximum supply of NFTs is exceeded.
     * - The `_mintAmount` is not 1 or 2.
     * - The user tries to mint more than 2 NFTs.
     * - The user tries to mint 2 NFTs but does not send the exact price.
     * - The user tries to mint 1 NFT but sends more than the exact price.
     * - The user is not on whitelist.
     */
    function mintPhase2(uint256 _mintAmount,bytes32[] calldata _merkleProof) external payable nonReentrant{
        require(!globalPause,"DMPC: contract is paused");
        require((block.timestamp >= startPhase2 && block.timestamp <= endPhase2) || !pausePhase2 ,"DMPC: Phase2 sale closed");
        require(_mintAmount == 1 || _mintAmount == 2, "DMPC: mintAmount must be 1 or 2");
        require(totalSupply() + _mintAmount <= maxSupply,"DMPC: maxSupply exceeded");
        require(addressWLMintedAmount[msg.sender] + _mintAmount <= maxMintPerWLWallet ,"DMPC: user cannot mint more then 2 NFT" );
        require(msg.value == price * _mintAmount,"DMPC: user must send the exact price");
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender))));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "DMPC: Invalid proof");
        
        addressWLMintedAmount[msg.sender] += _mintAmount;
        _safeMint(msg.sender,_mintAmount);
        emit MintPhase2(msg.sender, _mintAmount);     
    }

    /**
     * @dev Function to mint a batch of NFTs to multiple addresses
     * @param addresses An array of addresses to mint NFTs to
     * @param _mintAmounts The amount of NFTs to mint to each address
     * @notice Only the contract owner can call this function.
     */
    function mintBatch(address[] memory addresses, uint256 _mintAmounts) external onlyOwner{
        require(totalSupply() + addresses.length * _mintAmounts <= maxSupply,"DMPC: maxSupply exceeded");

        for(uint256 i = 0;i < addresses.length; i++){
            _safeMint(addresses[i],_mintAmounts);
        }

        emit MintBatch(msg.sender, addresses, _mintAmounts);
    }

    /**
     * @dev Sets the Merkle root on the contract
     * @param _merkleRoot bytes32: the Merkle root to be set
     * @notice Only the contract owner can call this function.
     */
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner{
        merkleRoot = _merkleRoot;
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
     * @dev Set the pause state of the contract for the WL Sale, only the contract owner can set the pause state
     * @param state Boolean state of the pause, true means that the contract is paused, false means that the contract is not paused
     */
    function setpausePhase1(bool state) external onlyOwner{
        pausePhase1 = state;
    }

    /**
     * @dev Set the pause state of the contract for the PB Sale, only the contract owner can set the pause state
     * @param state Boolean state of the pause, true means that the contract is paused, false means that the contract is not paused
     */
    function setpausePhase2(bool state) external onlyOwner{
        pausePhase2 = state;
    }

    /**
     * @dev Set the global pause state of the contract, only the contract owner can set the pause state
     * @param state Boolean state of the pause, true means that the contract is paused, false means that the contract is not paused
     */
    function setGlobalPause(bool state) external onlyOwner{
        globalPause = state;
    }

    /**
     * @dev Sets the uriSuffix for the ERC-721 token metadata.
     * @param _uriSuffix The new uriSuffix to be set.
     */
    function setUriSuffix(string memory _uriSuffix) public onlyOwner {
        uriSuffix = _uriSuffix;
    }

    /**
     * @dev Sets the payerAccount.
     * @param _payerAccount The new payerAccount.
     */
    function setPayerAccount(address _payerAccount) public onlyOwner {
        payerAccount = _payerAccount;
    }

    /**
     * setters for deviantsPASS Addresses;
     */
    function setDeviantsSilverPassCollection(ERC721A _deviantsSilverPassColeection) external onlyOwner{
        deviantsSilverPassCollection = _deviantsSilverPassColeection;
    }

    function setDeviantsDiamondPassCollection(ERC721A _deviantsDiamondPassColeection) external onlyOwner{
        deviantsDiamondPassCollection = _deviantsDiamondPassColeection;
    }

    function setDeviantsGoldPassCollection(ERC721A _deviantsGoldPassColeection) external onlyOwner{
        deviantsGoldPassCollection = _deviantsGoldPassColeection;
    }

    /**
     * @dev Returns the state of the Phase1 sale (true if is open, false if is closed)
     */
    function getPhase1Status() public view returns(bool){
        if((block.timestamp >= startPhase1 && block.timestamp <= endPhase1) || !pausePhase1) {
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * @dev Returns the state of the Phase2 sale (true if is open, false if is closed)
     */
    function getPhase2Status() public view returns(bool){
        if((block.timestamp >= startPhase2 && block.timestamp <= endPhase2) || !pausePhase2) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * @dev Returns total balance returns the total balance of nfts held(Silver + Dimond + Gold)
     */

    function getHolderStatus(address holder) public view returns(uint256){
        uint256 maxCrimsonMintAmount = deviantsSilverPassCollection.balanceOf(holder) * 2 + deviantsDiamondPassCollection.balanceOf(holder) * 3 + deviantsGoldPassCollection.balanceOf(holder) * 4;
        return maxCrimsonMintAmount - holderMintedAmount[holder];
    }

    
    /**
     * Transfers the total native coin balance to contract's owner account.
     * The balance must be > 0 so a zero transfer is avoided.
     * 
     * Access: Contract Owner
     */
    function withdraw() public nonReentrant {
        require(msg.sender == owner() || msg.sender == payerAccount, "DMPC: can be called only with the owner or payerAccount");
        uint256 balance = address(this).balance;
        require(balance != 0, "DMPC: contract balance is zero");
        sendViaCall(payable(payerAccount), balance);

        emit Withdraw(msg.sender, balance);
    }

    /**
     * @dev Function to transfer coins (the native cryptocurrency of the platform, i.e.: ETH) 
     * from this contract to the specified address.
     *
     * @param _to the address to transfer the coins to
     * @param _amount amount (in wei)
     */
    function sendViaCall(address payable _to, uint256 _amount) private {
        (bool sent, ) = _to.call { value: _amount } ("");
        require(sent, "DMPC: failed to send amount");
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

    function setApprovalForAll(address operator, bool approved) public  override(ERC721A,IERC721A) onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A,IERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        payable 
        override(ERC721A,IERC721A)
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }


}
