// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol" ;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol" ;
import "@openzeppelin/contracts/access/Ownable.sol" ;

contract NFT is ERC721Enumerable, Ownable { 

    using Counters for Counters.Counter;
    Counters.Counter private tokenCounter;
    address contractAddress;

    mapping(uint256 => string) public hashes;
    string public baseURI;

    constructor(address marketplaceAddress) ERC721("Metaverse", "METT") {
        contractAddress = marketplaceAddress;
        
    }


    function createToken(string memory tokenURIArr) public returns (uint256) {
        tokenCounter.increment();
        uint256 newItemId = tokenCounter.current();
        _safeMint(msg.sender, newItemId);
        hashes[newItemId] = tokenURIArr;
        setApprovalForAll(contractAddress, true);
        return newItemId;
    } 

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
      
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }  

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

     
        return hashes[tokenId]  ; 
        

    }

    
}
