import { type Address, erc20Abi } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const mockServerPrivateKey = "0x24c5da41fa32a59bafd2b8d650a5ddf93df5a01a55cdd7cb723ca9a02cd95d59";
const mockServerAccount = privateKeyToAccount(mockServerPrivateKey);

const mockReceiver = "0x3AB33a98Cea8E6e36113B3201194A9593621f5d3";

const expContract = {
	abi: erc20Abi,
	address: "0x29F45fc3eD1d0ffaFb5e2af9Cc6C3AB1555cd5a2" as Address,
};

export { mockServerAccount, mockReceiver, expContract };
