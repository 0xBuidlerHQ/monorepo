import * as viem_zksync from 'viem/zksync';
import * as viem_experimental from 'viem/experimental';
import * as viem_chains from 'viem/chains';
import * as viem from 'viem';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { z } from 'zod';

/**
 * @dev List of all the {Networks} the app interact with.
 */
declare const zNetworkId: z.ZodEnum<["mode", "ethereum", "base", "optimism", "arbitrum", "polygon", "linea", "zksync", "anvil", "sepolia", "baseSepolia"]>;
type NetworkId = z.infer<typeof zNetworkId>;
/**
 * @dev List of all the {Networks} name.
 */
declare const NetworkName: {
    readonly mode: "Mode";
    readonly ethereum: "Ethereum";
    readonly base: "Base";
    readonly optimism: "Optimism";
    readonly arbitrum: "Arbitrum";
    readonly polygon: "Polygon";
    readonly linea: "Linea";
    readonly zksync: "ZKsync";
    readonly anvil: "Anvil";
    readonly sepolia: "Sepolia";
    readonly baseSepolia: "Base Sepolia";
};
type NetworkName = (typeof NetworkName)[keyof typeof NetworkName];
declare const zNetworkName: z.ZodUnion<any>;
/**
 * @dev List of all the {Networks} logo.
 */
declare const NetworkLogo: {
    readonly mode: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly ethereum: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly base: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly optimism: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly arbitrum: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly polygon: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly linea: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly zksync: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly anvil: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly sepolia: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
    readonly baseSepolia: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
};
/**
 * @dev List of all the {Networks} chain id.
 */
declare const NetworkChainId: {
    readonly mode: 34443;
    readonly ethereum: 1;
    readonly base: 8453;
    readonly optimism: 10;
    readonly arbitrum: 42161;
    readonly polygon: 137;
    readonly linea: 59144;
    readonly zksync: 324;
    readonly anvil: 31337;
    readonly sepolia: 11155111;
    readonly baseSepolia: 84532;
};
type NetworkChainId = (typeof NetworkChainId)[keyof typeof NetworkChainId];
declare const zNetworkChainId: z.ZodUnion<any>;
/**
 * @dev List of all the {Networks} viem chain.
 */
declare const NetworkViemChain: {
    readonly mode: {
        blockExplorers: {
            readonly default: {
                readonly name: "Modescan";
                readonly url: "https://modescan.io";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 2465882;
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x4317ba146D4933D889518a3e5E11Fe7a53199b04";
                };
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07";
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x735aDBbE72226BD52e818E7181953f42E3b0FF21";
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 34443;
        name: "Mode Mainnet";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.mode.network"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    };
    readonly ethereum: {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
                readonly apiUrl: "https://api.etherscan.io/api";
            };
        };
        contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xce01f8eee7E479C928F8919abD53E553a36CeF67";
                readonly blockCreated: 19258213;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
        id: 1;
        name: "Ethereum";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly base: {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://basescan.org";
                readonly apiUrl: "https://api.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x56315b90c40730925ec5485cf004d835058518A0";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 5022;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";
                    readonly blockCreated: 17482143;
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";
                    readonly blockCreated: 17482143;
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 8453;
        name: "Base";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.base.org"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    };
    readonly optimism: {
        blockExplorers: {
            readonly default: {
                readonly name: "Optimism Explorer";
                readonly url: "https://optimistic.etherscan.io";
                readonly apiUrl: "https://api-optimistic.etherscan.io/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0xe5965Ab5962eDc7477C8520243A95517CD252fA9";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 4286263;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 10;
        name: "OP Mainnet";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.optimism.io"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    };
    readonly arbitrum: {
        blockExplorers: {
            readonly default: {
                readonly name: "Arbiscan";
                readonly url: "https://arbiscan.io";
                readonly apiUrl: "https://api.arbiscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 7654707;
            };
        };
        id: 42161;
        name: "Arbitrum One";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://arb1.arbitrum.io/rpc"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly polygon: {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://polygonscan.com";
                readonly apiUrl: "https://api.polygonscan.com/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 25770160;
            };
        };
        id: 137;
        name: "Polygon";
        nativeCurrency: {
            readonly name: "POL";
            readonly symbol: "POL";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://polygon-rpc.com"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly linea: {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://lineascan.build";
                readonly apiUrl: "https://api.lineascan.build/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
                readonly blockCreated: 42;
            };
        };
        id: 59144;
        name: "Linea Mainnet";
        nativeCurrency: {
            readonly name: "Linea Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc.linea.build"];
                readonly webSocket: readonly ["wss://rpc.linea.build"];
            };
        };
        sourceId?: number | undefined;
        testnet: false;
        custom?: Record<string, unknown> | undefined;
        fees: {
            readonly estimateFeesPerGas: ({ client, multiply, request, type, }: Parameters<viem.ChainEstimateFeesPerGasFn>[0]) => ReturnType<viem.ChainEstimateFeesPerGasFn>;
            readonly maxPriorityFeePerGas: ({ block, client, request }: viem.ChainFeesFnParameters<viem.ChainFormatters | undefined>) => Promise<bigint | null>;
        };
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly zksync: {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://era.zksync.network/";
                readonly apiUrl: "https://api-era.zksync.network/api";
            };
            readonly native: {
                readonly name: "ZKsync Explorer";
                readonly url: "https://explorer.zksync.io/";
                readonly apiUrl: "https://block-explorer-api.mainnet.zksync.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xF9cda624FBC7e059355ce98a31693d299FACd963";
            };
            readonly universalSignatureVerifier: {
                readonly address: "0xfB688330379976DA81eB64Fe4BF50d7401763B9C";
                readonly blockCreated: 45659388;
            };
        };
        id: 324;
        name: "ZKsync Era";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.era.zksync.io"];
                readonly webSocket: readonly ["wss://mainnet.era.zksync.io/ws"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom: {
            readonly getEip712Domain: viem_zksync.EIP712DomainFn<viem_zksync.ZkSyncTransactionSerializable, viem_zksync.ZkSyncEIP712TransactionSignable>;
        };
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_zksync.ZkSyncTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTimestamp: bigint | null;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcTransaction) => ({
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    type: "priority";
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    type: "eip712" | "priority";
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcTransactionReceipt) => {
                    type: viem_zksync.ZkSyncTransactionType;
                    to: viem.Address | null;
                    from: viem.Address;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    transactionIndex: number;
                    status: "success" | "reverted";
                    contractAddress: viem.Address | null | undefined;
                    logsBloom: viem.Hex;
                    blobGasUsed?: bigint | undefined;
                    gasUsed: bigint;
                    transactionHash: viem.Hash;
                    blobGasPrice?: bigint | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    root?: viem.Hash | undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    logs: viem_zksync.ZkSyncLog[];
                    l2ToL1Logs: viem_zksync.ZkSyncL2ToL1Log[];
                } & {};
                type: "transactionReceipt";
            };
            readonly transactionRequest: {
                exclude: ("paymaster" | "gasPerPubdata" | "factoryDeps" | "paymasterInput" | "customSignature")[] | undefined;
                format: (args: viem_zksync.ZkSyncTransactionRequest) => ({
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x0" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: `0x${string}` | undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    blobs?: undefined;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x1" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: `0x${string}` | undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    accessList?: viem.AccessList | undefined;
                    blobs?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x2" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    accessList?: viem.AccessList | undefined;
                    blobs?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    type?: "0x3" | undefined;
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    value?: `0x${string}` | undefined;
                    to: `0x${string}` | null;
                    gasPrice?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    maxFeePerBlobGas: `0x${string}`;
                    accessList?: viem.AccessList | undefined;
                    blobs: readonly viem.Hex[] | readonly viem.ByteArray[];
                    blobVersionedHashes?: readonly viem.Hex[] | undefined;
                    kzg?: viem.Kzg | undefined;
                    sidecars?: readonly viem.BlobSidecar<viem.Hex>[] | undefined;
                    authorizationList?: undefined;
                    eip712Meta?: undefined;
                } | {
                    type?: "0x4" | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    value?: `0x${string}` | undefined;
                    accessList?: viem.AccessList | undefined;
                    authorizationList?: viem_experimental.RpcAuthorizationList | undefined;
                    blobs?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type: "0xff" | "0x71";
                    value?: `0x${string}` | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    eip712Meta: viem_zksync.ZkSyncEip712Meta;
                }) & {
                    paymaster: never;
                    gasPerPubdata: never;
                    factoryDeps: never;
                    paymasterInput: never;
                    customSignature: never;
                };
                type: "transactionRequest";
            };
        };
        serializers: {
            readonly transaction: typeof viem_zksync.serializeTransaction;
        };
        readonly network: "zksync-era";
    };
    readonly anvil: {
        readonly blockExplorers: {
            readonly default: {
                readonly name: "#";
                readonly url: "#";
                readonly apiUrl: "#";
            };
        };
        readonly contracts?: viem.Prettify<{
            [key: string]: viem.ChainContract | {
                [sourceId: number]: viem.ChainContract | undefined;
            } | undefined;
        } & {
            ensRegistry?: viem.ChainContract | undefined;
            ensUniversalResolver?: viem.ChainContract | undefined;
            multicall3?: viem.ChainContract | undefined;
            universalSignatureVerifier?: viem.ChainContract | undefined;
        }> | undefined;
        readonly id: 31337;
        readonly name: "Anvil";
        readonly nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        readonly rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://127.0.0.1:8545"];
                readonly webSocket: readonly ["ws://127.0.0.1:8545"];
            };
        };
        readonly sourceId?: number | undefined;
        readonly testnet?: boolean | undefined;
        readonly custom?: Record<string, unknown> | undefined;
        readonly fees?: viem.ChainFees<undefined> | undefined;
        readonly formatters?: undefined;
        readonly serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly sepolia: {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://sepolia.etherscan.io";
                readonly apiUrl: "https://api-sepolia.etherscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 751532;
            };
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC";
                readonly blockCreated: 5317080;
            };
        };
        id: 11155111;
        name: "Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.drpc.org"];
            };
        };
        sourceId?: number | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly baseSepolia: {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://sepolia.basescan.org";
                readonly apiUrl: "https://api-sepolia.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 11155111: {
                    readonly address: "0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1";
                };
            };
            readonly l2OutputOracle: {
                readonly 11155111: {
                    readonly address: "0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254";
                };
            };
            readonly portal: {
                readonly 11155111: {
                    readonly address: "0x49f53e41452c74589e85ca1677426ba426459e85";
                    readonly blockCreated: 4446677;
                };
            };
            readonly l1StandardBridge: {
                readonly 11155111: {
                    readonly address: "0xfd0Bf71F60660E2f608ed56e1659C450eB113120";
                    readonly blockCreated: 4446677;
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 1059647;
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 84532;
        name: "Base Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.base.org"];
            };
        };
        sourceId: 11155111;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
        readonly network: "base-sepolia";
    };
};
/**
 * @dev
 */
declare const networkMetadata: (networkId: NetworkId | undefined) => {
    id: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    name: "Mode" | "Ethereum" | "Base" | "Optimism" | "Arbitrum" | "Polygon" | "Linea" | "ZKsync" | "Anvil" | "Sepolia" | "Base Sepolia";
    chainId: 1 | 10 | 34443 | 8453 | 42161 | 137 | 59144 | 324 | 31337 | 11155111 | 84532;
    chain: {
        blockExplorers: {
            readonly default: {
                readonly name: "Modescan";
                readonly url: "https://modescan.io";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 2465882;
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x4317ba146D4933D889518a3e5E11Fe7a53199b04";
                };
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07";
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x735aDBbE72226BD52e818E7181953f42E3b0FF21";
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 34443;
        name: "Mode Mainnet";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.mode.network"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
                readonly apiUrl: "https://api.etherscan.io/api";
            };
        };
        contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xce01f8eee7E479C928F8919abD53E553a36CeF67";
                readonly blockCreated: 19258213;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
        id: 1;
        name: "Ethereum";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://basescan.org";
                readonly apiUrl: "https://api.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x56315b90c40730925ec5485cf004d835058518A0";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 5022;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";
                    readonly blockCreated: 17482143;
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";
                    readonly blockCreated: 17482143;
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 8453;
        name: "Base";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.base.org"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Optimism Explorer";
                readonly url: "https://optimistic.etherscan.io";
                readonly apiUrl: "https://api-optimistic.etherscan.io/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0xe5965Ab5962eDc7477C8520243A95517CD252fA9";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 4286263;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 10;
        name: "OP Mainnet";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.optimism.io"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Arbiscan";
                readonly url: "https://arbiscan.io";
                readonly apiUrl: "https://api.arbiscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 7654707;
            };
        };
        id: 42161;
        name: "Arbitrum One";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://arb1.arbitrum.io/rpc"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://polygonscan.com";
                readonly apiUrl: "https://api.polygonscan.com/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 25770160;
            };
        };
        id: 137;
        name: "Polygon";
        nativeCurrency: {
            readonly name: "POL";
            readonly symbol: "POL";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://polygon-rpc.com"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://lineascan.build";
                readonly apiUrl: "https://api.lineascan.build/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
                readonly blockCreated: 42;
            };
        };
        id: 59144;
        name: "Linea Mainnet";
        nativeCurrency: {
            readonly name: "Linea Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc.linea.build"];
                readonly webSocket: readonly ["wss://rpc.linea.build"];
            };
        };
        sourceId?: number | undefined;
        testnet: false;
        custom?: Record<string, unknown> | undefined;
        fees: {
            readonly estimateFeesPerGas: ({ client, multiply, request, type, }: Parameters<viem.ChainEstimateFeesPerGasFn>[0]) => ReturnType<viem.ChainEstimateFeesPerGasFn>;
            readonly maxPriorityFeePerGas: ({ block, client, request }: viem.ChainFeesFnParameters<viem.ChainFormatters | undefined>) => Promise<bigint | null>;
        };
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://era.zksync.network/";
                readonly apiUrl: "https://api-era.zksync.network/api";
            };
            readonly native: {
                readonly name: "ZKsync Explorer";
                readonly url: "https://explorer.zksync.io/";
                readonly apiUrl: "https://block-explorer-api.mainnet.zksync.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xF9cda624FBC7e059355ce98a31693d299FACd963";
            };
            readonly universalSignatureVerifier: {
                readonly address: "0xfB688330379976DA81eB64Fe4BF50d7401763B9C";
                readonly blockCreated: 45659388;
            };
        };
        id: 324;
        name: "ZKsync Era";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.era.zksync.io"];
                readonly webSocket: readonly ["wss://mainnet.era.zksync.io/ws"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom: {
            readonly getEip712Domain: viem_zksync.EIP712DomainFn<viem_zksync.ZkSyncTransactionSerializable, viem_zksync.ZkSyncEIP712TransactionSignable>;
        };
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_zksync.ZkSyncTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTimestamp: bigint | null;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcTransaction) => ({
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    type: "priority";
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    type: "eip712" | "priority";
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcTransactionReceipt) => {
                    type: viem_zksync.ZkSyncTransactionType;
                    to: viem.Address | null;
                    from: viem.Address;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    transactionIndex: number;
                    status: "success" | "reverted";
                    contractAddress: viem.Address | null | undefined;
                    logsBloom: viem.Hex;
                    blobGasUsed?: bigint | undefined;
                    gasUsed: bigint;
                    transactionHash: viem.Hash;
                    blobGasPrice?: bigint | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    root?: viem.Hash | undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    logs: viem_zksync.ZkSyncLog[];
                    l2ToL1Logs: viem_zksync.ZkSyncL2ToL1Log[];
                } & {};
                type: "transactionReceipt";
            };
            readonly transactionRequest: {
                exclude: ("paymaster" | "gasPerPubdata" | "factoryDeps" | "paymasterInput" | "customSignature")[] | undefined;
                format: (args: viem_zksync.ZkSyncTransactionRequest) => ({
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x0" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: `0x${string}` | undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    blobs?: undefined;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x1" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: `0x${string}` | undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    accessList?: viem.AccessList | undefined;
                    blobs?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x2" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    accessList?: viem.AccessList | undefined;
                    blobs?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    type?: "0x3" | undefined;
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    value?: `0x${string}` | undefined;
                    to: `0x${string}` | null;
                    gasPrice?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    maxFeePerBlobGas: `0x${string}`;
                    accessList?: viem.AccessList | undefined;
                    blobs: readonly viem.Hex[] | readonly viem.ByteArray[];
                    blobVersionedHashes?: readonly viem.Hex[] | undefined;
                    kzg?: viem.Kzg | undefined;
                    sidecars?: readonly viem.BlobSidecar<viem.Hex>[] | undefined;
                    authorizationList?: undefined;
                    eip712Meta?: undefined;
                } | {
                    type?: "0x4" | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    value?: `0x${string}` | undefined;
                    accessList?: viem.AccessList | undefined;
                    authorizationList?: viem_experimental.RpcAuthorizationList | undefined;
                    blobs?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type: "0xff" | "0x71";
                    value?: `0x${string}` | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    eip712Meta: viem_zksync.ZkSyncEip712Meta;
                }) & {
                    paymaster: never;
                    gasPerPubdata: never;
                    factoryDeps: never;
                    paymasterInput: never;
                    customSignature: never;
                };
                type: "transactionRequest";
            };
        };
        serializers: {
            readonly transaction: typeof viem_zksync.serializeTransaction;
        };
        readonly network: "zksync-era";
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://sepolia.etherscan.io";
                readonly apiUrl: "https://api-sepolia.etherscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 751532;
            };
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC";
                readonly blockCreated: 5317080;
            };
        };
        id: 11155111;
        name: "Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.drpc.org"];
            };
        };
        sourceId?: number | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://sepolia.basescan.org";
                readonly apiUrl: "https://api-sepolia.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 11155111: {
                    readonly address: "0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1";
                };
            };
            readonly l2OutputOracle: {
                readonly 11155111: {
                    readonly address: "0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254";
                };
            };
            readonly portal: {
                readonly 11155111: {
                    readonly address: "0x49f53e41452c74589e85ca1677426ba426459e85";
                    readonly blockCreated: 4446677;
                };
            };
            readonly l1StandardBridge: {
                readonly 11155111: {
                    readonly address: "0xfd0Bf71F60660E2f608ed56e1659C450eB113120";
                    readonly blockCreated: 4446677;
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 1059647;
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 84532;
        name: "Base Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.base.org"];
            };
        };
        sourceId: 11155111;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
        readonly network: "base-sepolia";
    } | {
        readonly blockExplorers: {
            readonly default: {
                readonly name: "#";
                readonly url: "#";
                readonly apiUrl: "#";
            };
        };
        readonly contracts?: viem.Prettify<{
            [key: string]: viem.ChainContract | {
                [sourceId: number]: viem.ChainContract | undefined;
            } | undefined;
        } & {
            ensRegistry?: viem.ChainContract | undefined;
            ensUniversalResolver?: viem.ChainContract | undefined;
            multicall3?: viem.ChainContract | undefined;
            universalSignatureVerifier?: viem.ChainContract | undefined;
        }> | undefined;
        readonly id: 31337;
        readonly name: "Anvil";
        readonly nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        readonly rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://127.0.0.1:8545"];
                readonly webSocket: readonly ["ws://127.0.0.1:8545"];
            };
        };
        readonly sourceId?: number | undefined;
        readonly testnet?: boolean | undefined;
        readonly custom?: Record<string, unknown> | undefined;
        readonly fees?: viem.ChainFees<undefined> | undefined;
        readonly formatters?: undefined;
        readonly serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
type NetworkMetadata = NonNullable<ReturnType<typeof networkMetadata>>;
/**
 * @dev
 */
declare const networkMetadataByChainId: (networkChainId: NetworkChainId | number | undefined) => {
    id: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    name: "Mode" | "Ethereum" | "Base" | "Optimism" | "Arbitrum" | "Polygon" | "Linea" | "ZKsync" | "Anvil" | "Sepolia" | "Base Sepolia";
    chainId: 1 | 10 | 34443 | 8453 | 42161 | 137 | 59144 | 324 | 31337 | 11155111 | 84532;
    chain: {
        blockExplorers: {
            readonly default: {
                readonly name: "Modescan";
                readonly url: "https://modescan.io";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 2465882;
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x4317ba146D4933D889518a3e5E11Fe7a53199b04";
                };
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07";
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x735aDBbE72226BD52e818E7181953f42E3b0FF21";
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 34443;
        name: "Mode Mainnet";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.mode.network"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
                readonly apiUrl: "https://api.etherscan.io/api";
            };
        };
        contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xce01f8eee7E479C928F8919abD53E553a36CeF67";
                readonly blockCreated: 19258213;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
        id: 1;
        name: "Ethereum";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://basescan.org";
                readonly apiUrl: "https://api.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x56315b90c40730925ec5485cf004d835058518A0";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 5022;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";
                    readonly blockCreated: 17482143;
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";
                    readonly blockCreated: 17482143;
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 8453;
        name: "Base";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.base.org"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Optimism Explorer";
                readonly url: "https://optimistic.etherscan.io";
                readonly apiUrl: "https://api-optimistic.etherscan.io/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0xe5965Ab5962eDc7477C8520243A95517CD252fA9";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 4286263;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 10;
        name: "OP Mainnet";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.optimism.io"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Arbiscan";
                readonly url: "https://arbiscan.io";
                readonly apiUrl: "https://api.arbiscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 7654707;
            };
        };
        id: 42161;
        name: "Arbitrum One";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://arb1.arbitrum.io/rpc"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://polygonscan.com";
                readonly apiUrl: "https://api.polygonscan.com/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 25770160;
            };
        };
        id: 137;
        name: "Polygon";
        nativeCurrency: {
            readonly name: "POL";
            readonly symbol: "POL";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://polygon-rpc.com"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://lineascan.build";
                readonly apiUrl: "https://api.lineascan.build/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
                readonly blockCreated: 42;
            };
        };
        id: 59144;
        name: "Linea Mainnet";
        nativeCurrency: {
            readonly name: "Linea Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc.linea.build"];
                readonly webSocket: readonly ["wss://rpc.linea.build"];
            };
        };
        sourceId?: number | undefined;
        testnet: false;
        custom?: Record<string, unknown> | undefined;
        fees: {
            readonly estimateFeesPerGas: ({ client, multiply, request, type, }: Parameters<viem.ChainEstimateFeesPerGasFn>[0]) => ReturnType<viem.ChainEstimateFeesPerGasFn>;
            readonly maxPriorityFeePerGas: ({ block, client, request }: viem.ChainFeesFnParameters<viem.ChainFormatters | undefined>) => Promise<bigint | null>;
        };
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://era.zksync.network/";
                readonly apiUrl: "https://api-era.zksync.network/api";
            };
            readonly native: {
                readonly name: "ZKsync Explorer";
                readonly url: "https://explorer.zksync.io/";
                readonly apiUrl: "https://block-explorer-api.mainnet.zksync.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xF9cda624FBC7e059355ce98a31693d299FACd963";
            };
            readonly universalSignatureVerifier: {
                readonly address: "0xfB688330379976DA81eB64Fe4BF50d7401763B9C";
                readonly blockCreated: 45659388;
            };
        };
        id: 324;
        name: "ZKsync Era";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.era.zksync.io"];
                readonly webSocket: readonly ["wss://mainnet.era.zksync.io/ws"];
            };
        };
        sourceId?: number | undefined;
        testnet?: boolean | undefined;
        custom: {
            readonly getEip712Domain: viem_zksync.EIP712DomainFn<viem_zksync.ZkSyncTransactionSerializable, viem_zksync.ZkSyncEIP712TransactionSignable>;
        };
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_zksync.ZkSyncTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTimestamp: bigint | null;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcTransaction) => ({
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    type: "priority";
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    type: "eip712" | "priority";
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_zksync.ZkSyncRpcTransactionReceipt) => {
                    type: viem_zksync.ZkSyncTransactionType;
                    to: viem.Address | null;
                    from: viem.Address;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    transactionIndex: number;
                    status: "success" | "reverted";
                    contractAddress: viem.Address | null | undefined;
                    logsBloom: viem.Hex;
                    blobGasUsed?: bigint | undefined;
                    gasUsed: bigint;
                    transactionHash: viem.Hash;
                    blobGasPrice?: bigint | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    root?: viem.Hash | undefined;
                    l1BatchNumber: bigint | null;
                    l1BatchTxIndex: bigint | null;
                    logs: viem_zksync.ZkSyncLog[];
                    l2ToL1Logs: viem_zksync.ZkSyncL2ToL1Log[];
                } & {};
                type: "transactionReceipt";
            };
            readonly transactionRequest: {
                exclude: ("paymaster" | "gasPerPubdata" | "factoryDeps" | "paymasterInput" | "customSignature")[] | undefined;
                format: (args: viem_zksync.ZkSyncTransactionRequest) => ({
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x0" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: `0x${string}` | undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    blobs?: undefined;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x1" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: `0x${string}` | undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    accessList?: viem.AccessList | undefined;
                    blobs?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type?: "0x2" | undefined;
                    value?: `0x${string}` | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    accessList?: viem.AccessList | undefined;
                    blobs?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    type?: "0x3" | undefined;
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    value?: `0x${string}` | undefined;
                    to: `0x${string}` | null;
                    gasPrice?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    maxFeePerBlobGas: `0x${string}`;
                    accessList?: viem.AccessList | undefined;
                    blobs: readonly viem.Hex[] | readonly viem.ByteArray[];
                    blobVersionedHashes?: readonly viem.Hex[] | undefined;
                    kzg?: viem.Kzg | undefined;
                    sidecars?: readonly viem.BlobSidecar<viem.Hex>[] | undefined;
                    authorizationList?: undefined;
                    eip712Meta?: undefined;
                } | {
                    type?: "0x4" | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    value?: `0x${string}` | undefined;
                    accessList?: viem.AccessList | undefined;
                    authorizationList?: viem_experimental.RpcAuthorizationList | undefined;
                    blobs?: undefined;
                    blobVersionedHashes?: undefined;
                    kzg?: undefined;
                    sidecars?: undefined;
                    eip712Meta?: undefined;
                } | {
                    data?: viem.Hex | undefined;
                    from?: viem.Address | undefined;
                    gas?: `0x${string}` | undefined;
                    nonce?: `0x${string}` | undefined;
                    to?: viem.Address | null | undefined;
                    type: "0xff" | "0x71";
                    value?: `0x${string}` | undefined;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: `0x${string}` | undefined;
                    maxPriorityFeePerGas?: `0x${string}` | undefined;
                    eip712Meta: viem_zksync.ZkSyncEip712Meta;
                }) & {
                    paymaster: never;
                    gasPerPubdata: never;
                    factoryDeps: never;
                    paymasterInput: never;
                    customSignature: never;
                };
                type: "transactionRequest";
            };
        };
        serializers: {
            readonly transaction: typeof viem_zksync.serializeTransaction;
        };
        readonly network: "zksync-era";
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://sepolia.etherscan.io";
                readonly apiUrl: "https://api-sepolia.etherscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 751532;
            };
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC";
                readonly blockCreated: 5317080;
            };
        };
        id: 11155111;
        name: "Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.drpc.org"];
            };
        };
        sourceId?: number | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    } | {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://sepolia.basescan.org";
                readonly apiUrl: "https://api-sepolia.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 11155111: {
                    readonly address: "0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1";
                };
            };
            readonly l2OutputOracle: {
                readonly 11155111: {
                    readonly address: "0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254";
                };
            };
            readonly portal: {
                readonly 11155111: {
                    readonly address: "0x49f53e41452c74589e85ca1677426ba426459e85";
                    readonly blockCreated: 4446677;
                };
            };
            readonly l1StandardBridge: {
                readonly 11155111: {
                    readonly address: "0xfd0Bf71F60660E2f608ed56e1659C450eB113120";
                    readonly blockCreated: 4446677;
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 1059647;
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        id: 84532;
        name: "Base Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.base.org"];
            };
        };
        sourceId: 11155111;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: viem.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: viem.Hex | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined;
                    withdrawalsRoot?: viem.Hex | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: viem.Address | null;
                    from: viem.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId?: number | undefined;
                    yParity?: undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas?: undefined;
                    maxPriorityFeePerGas?: undefined;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: viem.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: viem.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem_experimental.SignedAuthorizationList;
                    blobVersionedHashes?: undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined;
                    maxFeePerBlobGas?: undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined;
                    mint?: undefined;
                    sourceHash?: undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: viem.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: viem.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: viem.Hash | undefined;
                    status: "success" | "reverted";
                    to: viem.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
        readonly network: "base-sepolia";
    } | {
        readonly blockExplorers: {
            readonly default: {
                readonly name: "#";
                readonly url: "#";
                readonly apiUrl: "#";
            };
        };
        readonly contracts?: viem.Prettify<{
            [key: string]: viem.ChainContract | {
                [sourceId: number]: viem.ChainContract | undefined;
            } | undefined;
        } & {
            ensRegistry?: viem.ChainContract | undefined;
            ensUniversalResolver?: viem.ChainContract | undefined;
            multicall3?: viem.ChainContract | undefined;
            universalSignatureVerifier?: viem.ChainContract | undefined;
        }> | undefined;
        readonly id: 31337;
        readonly name: "Anvil";
        readonly nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        readonly rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://127.0.0.1:8545"];
                readonly webSocket: readonly ["ws://127.0.0.1:8545"];
            };
        };
        readonly sourceId?: number | undefined;
        readonly testnet?: boolean | undefined;
        readonly custom?: Record<string, unknown> | undefined;
        readonly fees?: viem.ChainFees<undefined> | undefined;
        readonly formatters?: undefined;
        readonly serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
/**
 * @dev
 */
declare const networkIdByNetworkChainId: (networkChainId: NetworkChainId | number | undefined) => "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia" | undefined;

type networks_NetworkChainId = NetworkChainId;
type networks_NetworkId = NetworkId;
declare const networks_NetworkLogo: typeof NetworkLogo;
type networks_NetworkMetadata = NetworkMetadata;
type networks_NetworkName = NetworkName;
declare const networks_NetworkViemChain: typeof NetworkViemChain;
declare const networks_networkIdByNetworkChainId: typeof networkIdByNetworkChainId;
declare const networks_networkMetadata: typeof networkMetadata;
declare const networks_networkMetadataByChainId: typeof networkMetadataByChainId;
declare const networks_zNetworkChainId: typeof zNetworkChainId;
declare const networks_zNetworkId: typeof zNetworkId;
declare const networks_zNetworkName: typeof zNetworkName;
declare namespace networks {
  export { type networks_NetworkChainId as NetworkChainId, type networks_NetworkId as NetworkId, networks_NetworkLogo as NetworkLogo, type networks_NetworkMetadata as NetworkMetadata, type networks_NetworkName as NetworkName, networks_NetworkViemChain as NetworkViemChain, networks_networkIdByNetworkChainId as networkIdByNetworkChainId, networks_networkMetadata as networkMetadata, networks_networkMetadataByChainId as networkMetadataByChainId, networks_zNetworkChainId as zNetworkChainId, networks_zNetworkId as zNetworkId, networks_zNetworkName as zNetworkName };
}

export { type NetworkId as N, NetworkChainId as a, zNetworkName as b, zNetworkChainId as c, NetworkLogo as d, networkMetadata as e, networkIdByNetworkChainId as f, networkMetadataByChainId as g, NetworkName as h, type NetworkMetadata as i, NetworkViemChain as j, networks as n, zNetworkId as z };
