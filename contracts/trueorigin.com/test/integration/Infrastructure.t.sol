// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface Vm {
    function createSelectFork(string calldata rpcAlias) external returns (uint256);
}

contract InfrastructureTest {
    Vm private constant VM = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function testEthereumForkContainsAccountInfrastructure() public {
        VM.createSelectFork("local");
        require(block.chainid == 31337, "Expected the isolated local fork");
        require(address(0x0000000071727De22E5E9d8BAf0edAc6f37da032).code.length > 0, "EntryPoint missing");
        require(address(0x2577507b78c2008Ff367261CB6285d44ba5eF2E9).code.length > 0, "Kernel factory missing");
        require(address(0x7ab16Ff354AcB328452F1D445b3Ddee9a91e9e69).code.length > 0, "Passkey validator missing");
    }
}
