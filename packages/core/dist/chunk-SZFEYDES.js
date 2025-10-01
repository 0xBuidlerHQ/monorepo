import {
  __export
} from "./chunk-PZ5AY32C.js";

// src/format/index.ts
var format_exports = {};
__export(format_exports, {
  FormatEvmAddress: () => FormatEvmAddress,
  FormatEvmHash: () => FormatEvmHash,
  FormatExplorerAddress: () => FormatExplorerAddress,
  FormatExplorerBlock: () => FormatExplorerBlock,
  FormatExplorerTransaction: () => FormatExplorerTransaction,
  FormatNumber: () => FormatNumber,
  FormatPercent: () => FormatPercent,
  FormatUSD: () => FormatUSD,
  FormatUnits: () => FormatUnits
});
import { formatUnits, parseUnits } from "viem";
var FormatUSD = {
  classic: (value, config) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...config
  }).format(value),
  full: (value, config) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 100,
    ...config
  }).format(value)
};
var FormatPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
var FormatNumber = new Intl.NumberFormat("en-US", {
  style: "decimal",
  roundingMode: "trunc",
  maximumFractionDigits: 4
});
var FormatUnits = {
  format: (value, decimals) => {
    if (value === void 0 || decimals === void 0) return "0";
    return formatUnits(value, decimals);
  },
  parse: (value, decimals) => {
    if (value === void 0 || decimals === void 0) return 0n;
    return parseUnits(value, decimals);
  }
};
var FormatEvmHash = (hash) => hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : hash;
var FormatEvmAddress = (address) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : void 0;
var FormatExplorerAddress = (blockExplorerUrl, address) => {
  if (!blockExplorerUrl || !address) return "#";
  return `${blockExplorerUrl}/address/${address}`;
};
var FormatExplorerTransaction = (blockExplorerUrl, txHash) => {
  if (!blockExplorerUrl || !txHash) return "#";
  return `${blockExplorerUrl}/tx/${txHash}`;
};
var FormatExplorerBlock = (blockExplorerUrl, blockNumber) => {
  if (!blockExplorerUrl || !blockNumber) return "#";
  return `${blockExplorerUrl}/block/${blockNumber}`;
};

export {
  FormatUSD,
  FormatPercent,
  FormatNumber,
  FormatUnits,
  FormatEvmHash,
  FormatEvmAddress,
  FormatExplorerAddress,
  FormatExplorerTransaction,
  FormatExplorerBlock,
  format_exports
};
//# sourceMappingURL=chunk-SZFEYDES.js.map