// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {TrueOriginPassport} from "../../src/TrueOriginPassport.sol";
import {DeployTrueOriginPassport} from "../../script/DeployTrueOriginPassport.s.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {
    IAccessControlDefaultAdminRules
} from "@openzeppelin/contracts/access/extensions/IAccessControlDefaultAdminRules.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface PassportVm {
    function prank(address sender) external;
    function expectRevert(bytes calldata revertData) external;
    function expectRevert(bytes4 selector) external;
    function expectEmit(bool topic1, bool topic2, bool topic3, bool data, address emitter) external;
    function warp(uint256 timestamp) external;
    function chainId(uint256 newChainId) external;
}

contract PassportReceiver is IERC721Receiver {
    TrueOriginPassport private immutable PASSPORT;
    bytes32 private immutable ITEM_ID;
    string private uri;
    bool public received;

    constructor(TrueOriginPassport passport_, bytes32 itemId_, string memory uri_) {
        PASSPORT = passport_;
        ITEM_ID = itemId_;
        uri = uri_;
    }

    function onERC721Received(address, address, uint256 tokenId, bytes calldata) external returns (bytes4) {
        require(msg.sender == address(PASSPORT), "Wrong collection");
        require(PASSPORT.ownerOf(tokenId) == address(this), "Owner unavailable during callback");
        require(PASSPORT.itemIdOf(tokenId) == ITEM_ID, "Item unavailable during callback");
        require(PASSPORT.tokenIdForItem(ITEM_ID) == tokenId, "Reverse lookup unavailable during callback");
        require(
            keccak256(bytes(PASSPORT.tokenURI(tokenId))) == keccak256(bytes(uri)), "URI unavailable during callback"
        );
        received = true;
        return IERC721Receiver.onERC721Received.selector;
    }
}

contract RejectingReceiver is IERC721Receiver {
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return bytes4(0);
    }
}

contract ReenteringReceiver is IERC721Receiver {
    TrueOriginPassport private immutable PASSPORT;
    bool public blocked;

    constructor(TrueOriginPassport passport_) {
        PASSPORT = passport_;
    }

    function issue() external {
        PASSPORT.issuePassport(address(this), keccak256("first"), "ipfs://first/metadata.json");
    }

    function onERC721Received(address, address, uint256, bytes calldata) external returns (bytes4) {
        try PASSPORT.issuePassport(address(this), keccak256("second"), "ipfs://second/metadata.json") {
            revert("Reentrant mint succeeded");
        } catch (bytes memory reason) {
            // Only the first four bytes are needed to compare an error selector.
            // forge-lint: disable-next-line(unsafe-typecast)
            require(bytes4(reason) == ReentrancyGuard.ReentrancyGuardReentrantCall.selector, "Unexpected revert");
            blocked = true;
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}

contract TrueOriginPassportTest {
    PassportVm private constant VM = PassportVm(address(uint160(uint256(keccak256("hevm cheat code")))));
    address private constant ADMIN = address(0xA11);
    address private constant ISSUER = address(0x155);
    address private constant ALICE = address(0xA11CE);
    address private constant BOB = address(0xB0B);
    bytes32 private constant ITEM = keccak256("opaque-trueorigin-item-id");
    string private constant URI = "ipfs://bafy-test/metadata.json";
    TrueOriginPassport private passport;

    event PassportIssued(uint256 indexed tokenId, bytes32 indexed itemId, address indexed recipient, address issuer);

    function setUp() public {
        passport = new TrueOriginPassport(ADMIN, ISSUER);
    }

    function issue() private returns (uint256) {
        VM.prank(ISSUER);
        return passport.issuePassport(ALICE, ITEM, URI);
    }

    function testInitialRolesAreExplicitAndSeparate() public view {
        require(passport.defaultAdmin() == ADMIN, "Wrong admin");
        require(passport.defaultAdminDelay() == 2 days, "Wrong delay");
        require(passport.hasRole(passport.ISSUER_ROLE(), ISSUER), "Issuer missing");
        require(!passport.hasRole(passport.ISSUER_ROLE(), ADMIN), "Admin unexpectedly issues");
        require(!passport.hasRole(passport.DEFAULT_ADMIN_ROLE(), address(this)), "Deployer retains authority");
        require(keccak256(bytes(passport.name())) == keccak256("TrueOrigin Passport"), "Wrong name");
    }

    function testRejectZeroAdmin() public {
        VM.expectRevert(
            abi.encodeWithSelector(
                IAccessControlDefaultAdminRules.AccessControlInvalidDefaultAdmin.selector, address(0)
            )
        );
        new TrueOriginPassport(address(0), ISSUER);
    }

    function testRejectZeroIssuer() public {
        VM.expectRevert(TrueOriginPassport.InvalidIssuer.selector);
        new TrueOriginPassport(ADMIN, address(0));
    }

    function testIssueRecordsPassportAndEvent() public {
        VM.expectEmit(true, true, true, true, address(passport));
        emit PassportIssued(1, ITEM, ALICE, ISSUER);
        uint256 tokenId = issue();
        require(tokenId == 1 && passport.ownerOf(tokenId) == ALICE, "Wrong ownership");
        require(passport.balanceOf(ALICE) == 1, "Wrong balance");
        require(passport.itemIdOf(tokenId) == ITEM && passport.tokenIdForItem(ITEM) == tokenId, "Wrong item");
        require(keccak256(bytes(passport.tokenURI(tokenId))) == keccak256(bytes(URI)), "Wrong metadata");
    }

    function testFuzzOnlyIssuerCanMint(address caller) public {
        if (caller == ISSUER) return;
        bytes32 role = passport.ISSUER_ROLE();
        VM.expectRevert(abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, caller, role));
        VM.prank(caller);
        passport.issuePassport(ALICE, ITEM, URI);
    }

    function testDuplicateItemCannotBeMintedEvenAfterTransfer() public {
        uint256 tokenId = issue();
        VM.prank(ALICE);
        passport.transferFrom(ALICE, BOB, tokenId);
        VM.expectRevert(abi.encodeWithSelector(TrueOriginPassport.ItemAlreadyRegistered.selector, ITEM, tokenId));
        VM.prank(ISSUER);
        passport.issuePassport(BOB, ITEM, URI);
    }

    function testRejectEmptyItemId() public {
        VM.expectRevert(TrueOriginPassport.InvalidItemId.selector);
        VM.prank(ISSUER);
        passport.issuePassport(ALICE, bytes32(0), URI);
    }

    function testRejectMutableOrEmptyMetadataURIs() public {
        string[5] memory invalid =
            ["", "https://example.com/metadata.json", "http://localhost:3003/file", "ipns://mutable", "ipfs://"];
        for (uint256 i; i < invalid.length; ++i) {
            VM.expectRevert(TrueOriginPassport.InvalidMetadataURI.selector);
            VM.prank(ISSUER);
            passport.issuePassport(ALICE, ITEM, invalid[i]);
        }
        require(passport.tokenIdForItem(ITEM) == 0, "Invalid issuance reserved item");
    }

    function testZeroRecipientRollsBackRegistrationAndSequence() public {
        VM.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InvalidReceiver.selector, address(0)));
        VM.prank(ISSUER);
        passport.issuePassport(address(0), ITEM, URI);
        require(passport.tokenIdForItem(ITEM) == 0, "Reserved item after failure");
        require(issue() == 1, "Failed mint consumed token ID");
    }

    function testSafeMintMakesMetadataAvailableInsideReceiver() public {
        PassportReceiver receiver = new PassportReceiver(passport, ITEM, URI);
        VM.prank(ISSUER);
        passport.issuePassport(address(receiver), ITEM, URI);
        require(receiver.received(), "Callback missing");
    }

    function testRejectingReceiverRollsBackAllState() public {
        RejectingReceiver receiver = new RejectingReceiver();
        VM.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InvalidReceiver.selector, address(receiver)));
        VM.prank(ISSUER);
        passport.issuePassport(address(receiver), ITEM, URI);
        require(passport.tokenIdForItem(ITEM) == 0 && passport.itemIdOf(1) == bytes32(0), "Partial mint survived");
        require(issue() == 1, "Cannot retry failed mint");
    }

    function testCannotMintToNonReceivingContract() public {
        VM.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InvalidReceiver.selector, address(this)));
        VM.prank(ISSUER);
        passport.issuePassport(address(this), ITEM, URI);
    }

    function testCounterfactualWalletCanReceiveBeforeDeployment() public {
        address undeployedWallet = address(0x123456789);
        require(undeployedWallet.code.length == 0, "Expected undeployed account");
        VM.prank(ISSUER);
        uint256 tokenId = passport.issuePassport(undeployedWallet, ITEM, URI);
        require(passport.ownerOf(tokenId) == undeployedWallet, "Counterfactual mint failed");
    }

    function testOwnerCanTransferWithoutTrueOriginApproval() public {
        uint256 tokenId = issue();
        VM.prank(ALICE);
        passport.safeTransferFrom(ALICE, BOB, tokenId);
        require(passport.ownerOf(tokenId) == BOB, "Transfer restricted");
        require(passport.itemIdOf(tokenId) == ITEM, "Transfer changed identity");
        require(keccak256(bytes(passport.tokenURI(tokenId))) == keccak256(bytes(URI)), "Transfer changed metadata");
    }

    function testOwnerCanApproveExternalOperatorAndTransferClearsApproval() public {
        uint256 tokenId = issue();
        VM.prank(ALICE);
        passport.approve(ISSUER, tokenId);
        VM.prank(ISSUER);
        passport.transferFrom(ALICE, BOB, tokenId);
        require(passport.ownerOf(tokenId) == BOB, "Operator transfer failed");
        require(passport.getApproved(tokenId) == address(0), "Stale approval");
    }

    function testAdminAndIssuerCannotSeizeOrApproveOwnersNFT() public {
        uint256 tokenId = issue();
        address[2] memory privileged = [ADMIN, ISSUER];
        for (uint256 i; i < privileged.length; ++i) {
            VM.expectRevert(
                abi.encodeWithSelector(IERC721Errors.ERC721InsufficientApproval.selector, privileged[i], tokenId)
            );
            VM.prank(privileged[i]);
            passport.transferFrom(ALICE, privileged[i], tokenId);
            VM.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721InvalidApprover.selector, privileged[i]));
            VM.prank(privileged[i]);
            passport.approve(privileged[i], tokenId);
        }
        require(passport.ownerOf(tokenId) == ALICE, "Ownership changed");
    }

    function testRevokingIssuerDoesNotFreezeOwnerTransfers() public {
        uint256 tokenId = issue();
        bytes32 role = passport.ISSUER_ROLE();
        VM.prank(ADMIN);
        passport.revokeRole(role, ISSUER);
        VM.expectRevert(abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, ISSUER, role));
        VM.prank(ISSUER);
        passport.issuePassport(ALICE, keccak256("another-item"), URI);
        VM.prank(ALICE);
        passport.transferFrom(ALICE, BOB, tokenId);
        require(passport.ownerOf(tokenId) == BOB, "Issuer revocation froze transfers");
    }

    function testAdminCanRotateIssuerWithoutChangingPassport() public {
        uint256 tokenId = issue();
        bytes32 role = passport.ISSUER_ROLE();
        VM.prank(ADMIN);
        passport.grantRole(role, BOB);
        VM.prank(BOB);
        uint256 nextId = passport.issuePassport(ALICE, keccak256("second-item"), URI);
        require(nextId == 2 && passport.ownerOf(tokenId) == ALICE, "Rotation changed passport");
    }

    function testAdminTransferIsDelayedAndRequiresAcceptance() public {
        VM.prank(ADMIN);
        passport.beginDefaultAdminTransfer(BOB);
        (, uint48 schedule) = passport.pendingDefaultAdmin();
        VM.expectRevert(
            abi.encodeWithSelector(
                IAccessControlDefaultAdminRules.AccessControlEnforcedDefaultAdminDelay.selector, schedule
            )
        );
        VM.prank(BOB);
        passport.acceptDefaultAdminTransfer();
        VM.warp(block.timestamp + 2 days + 1);
        VM.prank(BOB);
        passport.acceptDefaultAdminTransfer();
        require(passport.defaultAdmin() == BOB, "Admin did not transfer");
        require(!passport.hasRole(passport.DEFAULT_ADMIN_ROLE(), ADMIN), "Old admin retained authority");
    }

    function testMetadataCannotBeRewrittenAndTokenCannotBeBurnedByAdmin() public {
        uint256 tokenId = issue();
        VM.prank(ADMIN);
        (bool changed,) = address(passport)
            .call(abi.encodeWithSignature("setTokenURI(uint256,string)", tokenId, "ipfs://replacement"));
        require(!changed, "Unexpected metadata setter");
        VM.prank(ADMIN);
        (bool burned,) = address(passport).call(abi.encodeWithSignature("burn(uint256)", tokenId));
        require(!burned && passport.ownerOf(tokenId) == ALICE, "Unexpected burn");
        require(keccak256(bytes(passport.tokenURI(tokenId))) == keccak256(bytes(URI)), "Metadata changed");
    }

    function testReceiverCannotReenterIssuance() public {
        ReenteringReceiver receiver = new ReenteringReceiver(passport);
        bytes32 role = passport.ISSUER_ROLE();
        VM.prank(ADMIN);
        passport.grantRole(role, address(receiver));
        receiver.issue();
        require(receiver.blocked(), "Reentrancy guard not exercised");
        require(passport.tokenIdForItem(keccak256("second")) == 0, "Reentrant item registered");
    }

    function testMissingTokenURIReverts() public {
        VM.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 123));
        passport.tokenURI(123);
    }

    function testLocalDeploymentScriptRejectsMainnet() public {
        DeployTrueOriginPassport deployment = new DeployTrueOriginPassport();
        VM.chainId(1);
        VM.expectRevert(abi.encodeWithSignature("Error(string)", "Local chain only"));
        deployment.run();
    }

    function testSupportsStandardInterfaces() public view {
        require(passport.supportsInterface(0x01ffc9a7), "ERC165 missing");
        require(passport.supportsInterface(0x80ac58cd), "ERC721 missing");
        require(passport.supportsInterface(0x5b5e139f), "Metadata missing");
        require(passport.supportsInterface(type(IAccessControl).interfaceId), "Access control missing");
        require(!passport.supportsInterface(0xffffffff), "Invalid interface accepted");
    }

    function testFuzzOpaqueItemIdsStayUnique(bytes32 first, bytes32 second) public {
        if (first == bytes32(0) || second == bytes32(0) || first == second) return;
        VM.prank(ISSUER);
        uint256 firstId = passport.issuePassport(ALICE, first, URI);
        VM.prank(ISSUER);
        uint256 secondId = passport.issuePassport(BOB, second, URI);
        require(firstId != secondId, "Token IDs collide");
        require(passport.itemIdOf(firstId) == first && passport.itemIdOf(secondId) == second, "Item IDs collide");
    }
}
