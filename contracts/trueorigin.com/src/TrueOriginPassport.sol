// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {
    AccessControlDefaultAdminRules
} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title TrueOrigin digital item passports
/// @notice NFT ownership and transfer do not, by themselves, prove physical possession or delivery.
/// @dev Initial, non-upgradeable foundation. No burn, transfer freeze, seizure, or metadata rewrite functions.
contract TrueOriginPassport is ERC721, AccessControlDefaultAdminRules, ReentrancyGuard {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    uint48 public constant INITIAL_ADMIN_DELAY = 2 days;

    /// @notice Zero means that no passport has been issued for this item ID.
    mapping(bytes32 itemId => uint256 tokenId) public tokenIdForItem;
    mapping(uint256 tokenId => bytes32 itemId) public itemIdOf;
    mapping(uint256 tokenId => string uri) private _metadataUris;
    uint256 private _nextTokenId = 1;

    error InvalidIssuer();
    error InvalidItemId();
    error ItemAlreadyRegistered(bytes32 itemId, uint256 tokenId);
    error InvalidMetadataURI();

    event PassportIssued(uint256 indexed tokenId, bytes32 indexed itemId, address indexed recipient, address issuer);

    constructor(address admin, address issuer)
        ERC721("TrueOrigin Passport", "ORIGIN")
        AccessControlDefaultAdminRules(INITIAL_ADMIN_DELAY, admin)
    {
        if (issuer == address(0)) revert InvalidIssuer();
        _grantRole(ISSUER_ROLE, issuer);
    }

    /// @notice Issue a passport after the off-chain inspection has been approved.
    /// @param recipient The owner's wallet, including an undeployed counterfactual smart account.
    /// @param itemId Permanent, opaque TrueOrigin item ID. Do not use an email or other personal data.
    /// @param metadataURI Content-addressed public JSON metadata, using an ipfs:// URI.
    /// @dev The issuer must validate and pin the metadata and ensure the physical item is not registered twice.
    function issuePassport(address recipient, bytes32 itemId, string calldata metadataURI)
        external
        onlyRole(ISSUER_ROLE)
        nonReentrant
        returns (uint256 tokenId)
    {
        if (itemId == bytes32(0)) revert InvalidItemId();
        uint256 existing = tokenIdForItem[itemId];
        if (existing != 0) revert ItemAlreadyRegistered(itemId, existing);
        bytes memory uri = bytes(metadataURI);
        // Compare just the scheme; the issuer validates the CID and document off-chain.
        // forge-lint: disable-next-line(unsafe-typecast)
        if (uri.length <= 7 || bytes7(uri) != bytes7("ipfs://")) revert InvalidMetadataURI();

        tokenId = _nextTokenId++;
        tokenIdForItem[itemId] = tokenId;
        itemIdOf[tokenId] = itemId;
        _metadataUris[tokenId] = metadataURI;

        // All passport data is available to receiving smart contracts during their callback.
        // Emit before calling the receiver, which may legitimately transfer the NFT during the callback.
        emit PassportIssued(tokenId, itemId, recipient, msg.sender);
        _safeMint(recipient, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _metadataUris[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControlDefaultAdminRules)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
