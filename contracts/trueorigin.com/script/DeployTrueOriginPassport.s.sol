// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {TrueOriginPassport} from "../src/TrueOriginPassport.sol";

interface DeploymentVm {
    function envAddress(string calldata name) external view returns (address);
    function startBroadcast() external;
    function stopBroadcast() external;
}

/// @notice Local deployment only. A production deployment requires a separate reviewed script.
contract DeployTrueOriginPassport {
    DeploymentVm private constant VM = DeploymentVm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (TrueOriginPassport passport) {
        require(block.chainid == 31337, "Local chain only");
        address admin = VM.envAddress("PASSPORT_ADMIN");
        address issuer = VM.envAddress("PASSPORT_ISSUER");
        VM.startBroadcast();
        passport = new TrueOriginPassport(admin, issuer);
        VM.stopBroadcast();
    }
}
