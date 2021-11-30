// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FactItem is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping (string => bool) factExists;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721 ("FactItem", "FACT") {}

    function mintItem(
        string memory factURL
    ) external returns (uint256) {
        require(!factExists[factURL], "fact URL already added");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, factURL);

        factExists[factURL] = true;

        return newItemId;        
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
}