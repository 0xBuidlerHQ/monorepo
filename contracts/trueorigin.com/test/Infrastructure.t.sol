// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface Vm {
    function createSelectFork(string calldata rpcAlias) external returns (uint256);
}

contract InfrastructureTest {
    Vm constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function testEthereumForkContainsAccountInfrastructure() public {
        vm.createSelectFork("local");
        require(block.chainid == 31337, "Expected the isolated local fork");
        require(address(bytes20(hex"0000000071727de22e5e9d8baf0edac6f37da032")).code.length > 0, "EntryPoint missing");
        require(address(bytes20(hex"2577507b78c2008ff367261cb6285d44ba5ef2e9")).code.length > 0, "Kernel factory missing");
        require(address(bytes20(hex"7ab16ff354acb328452f1d445b3ddee9a91e9e69")).code.length > 0, "Passkey validator missing");
    }
}
