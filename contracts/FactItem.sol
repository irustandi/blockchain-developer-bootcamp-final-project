// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
    @title A contract representing facts, using the ERC-721 standard
    Each fact is supposed to be a URI to an article.
 */
contract FactItem is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping (string => bool) private _factExists;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721 ("FactItem", "FACT") {}

    /**
        Mint a fact item. Cannot mint a URL/URI already previously minted.
        @param factURL the URL/URI for the fact item
        @return newItemId the token ID of the minted fact
     */
    function mintItem(
        string memory factURL
    ) external returns (uint256) {
        require(!_factExists[factURL], "fact URL already added");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, factURL);

        _factExists[factURL] = true;

        return newItemId;        
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
        Get the URL/URI associated with a particular fact.
        @param tokenId the ID for the fact
        @return the URL/URI for the fact
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return _tokenURIs[tokenId];
    }
}