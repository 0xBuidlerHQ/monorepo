---
title: "[ Layer 2 ] 101"
draft: false
---

Alice understands what backs the 500 USDC discussed in [\[ Stablecoins \] 101](/en/learn/stablecoins-101). She withdraws 200 of those USDC from her lending position to use in another application.

The application offers several networks: Ethereum, Arbitrum One, Base, and OP Mainnet. Some show lower transaction fees. Alice connects her usual wallet, selects Arbitrum One, and sees no USDC there.

Her money has not disappeared. She is looking at a different network. To understand where her assets are and how she can use them there, we need to examine Ethereum’s **Layer 2 networks**, usually called **L2s**.

## Why use another network?

Ethereum’s main network is its **Layer 1**, or **L1**. It has limited capacity for executing transactions and recording their data. When many people want to use that capacity, they compete for it through transaction fees.

A Layer 2 handles execution on a separate network while using Ethereum to help establish and enforce the accepted results. The idea is to process more activity without requiring Ethereum’s main network to execute each user action individually.

**Arbitrum One, Base, and OP Mainnet** are examples of Ethereum L2s. They are distinct networks with their own activity and applications, rather than three names for the same Ethereum balance.

Moving work to another network would be easy if users simply trusted its operator. The important question is how Ethereum can help secure the result. A common answer is the **rollup**.

## Rollups and the connection to Ethereum

A rollup executes transactions on its own network, then publishes data about batches of activity and commitments to the resulting **state** on Ethereum: the balances and contract data after those transactions. A commitment is a compact reference to that state, such as a hash.

A **sequencer** commonly receives requests, orders them, and gives users a quick view of the result. Other nodes can check execution. Ethereum contracts and the rollup’s verification mechanism determine which results can be accepted for settlement.

Many user actions can share the cost of publishing a batch to Ethereum. Combined with a different execution environment and compressed data, this helps make L2 transactions cheaper. Fees still depend on the network and demand; they are not fixed or always lower.

Two major approaches handle the validity of the results. **Optimistic rollups** allow proposed results to be challenged during a defined period. A successful challenge prevents an invalid result from being accepted. This relies on the challenge system working and participants being able to use it.

**Validity rollups**, often called **ZK-rollups**, submit cryptographic proofs that the proposed state change follows the rules. Ethereum verifies the proof rather than re-executing every user action. Their security still depends on correct proof systems, contracts, and access to the required data.

These mechanisms explain what an L2 adds beyond a cheap independent blockchain: a way to connect its execution to Ethereum’s settlement rules. The actual protection depends on how that particular system is built and operated.

## One wallet, separate balances

Alice can use the same wallet address on Ethereum and Arbitrum One. That does not create a single balance shared between the networks.

Her 200 USDC are recorded by the USDC contract on Ethereum. Selecting Arbitrum One asks the wallet to read that network’s records, where Alice may hold no USDC yet. Switching back to Ethereum reveals the original balance.

An application can likewise have different deployments on different networks. A lending pool on Ethereum and one on Arbitrum One do not automatically share deposits, available liquidity, or rates just because they use the same app name.

For Alice, identifying an asset now requires both **the network and the token contract**. A familiar ticker alone is not enough. To make assets available on another network, she needs a transfer process between them.

## Bridges and cross-network transfers

A **bridge** coordinates an asset transfer or a message between networks. It does not physically move a token out of one blockchain’s database and into another.

In one common design, a contract locks tokens on the source network. After the destination accepts evidence of that deposit, it issues a corresponding representation there. Returning through that bridge reverses the process: the representation is destroyed and the locked assets can be released under the bridge’s rules.

Another approach works through the asset’s issuer. For USDC, Circle’s **Cross-Chain Transfer Protocol**, or **CCTP**, burns units on the source network and mints native USDC on a supported destination after Circle attests to the burn. This avoids creating a token representing USDC locked in a traditional bridge, but retains a dependency on Circle’s infrastructure and authorization.

Alice chooses a supported route for the native USDC her destination application accepts. Once the process completes, the transferred amount is available on Arbitrum One rather than simultaneously spendable on both networks.

The route matters. A rollup’s own bridge, a third-party bridge, and an issuer’s transfer protocol can have different verification methods, delays, and administrative powers. Choosing the destination network does not by itself determine the security of the transfer.

## Native tokens and bridged versions

On Arbitrum One, **native USDC** and **USDC.e** illustrate why the exact asset matters. Native USDC is issued by Circle on that network. USDC.e is a bridged representation of USDC from Ethereum, backed through the relevant bridge.

They target the same dollar value, but have different contracts and dependencies. A service may accept one and not the other. The prices and liquidity available for exchanging them can also differ.

Here, “native USDC” means issued directly by Circle on that network. It does not mean USDC is the network’s native currency in the sense that ETH is Ethereum’s native currency.

Alice therefore checks which version the application uses. If she receives a bridged version while the application expects native USDC, merely changing its display name cannot make them interchangeable; she needs a supported conversion or another transfer route.

Alice therefore needs to understand both what backs the dollar value and how this particular token connects to that backing.

## Quick confirmations and final settlement

After receiving the appropriate USDC, Alice can use the application on Arbitrum One. Its sequencer may show her transaction’s result quickly, while publication and settlement on Ethereum happen later.

Seeing that quick result is different from completing a withdrawal to Ethereum. A standard withdrawal through an optimistic rollup’s own bridge can involve waiting several days for its challenge process. A faster service may advance assets on the destination, introducing its own liquidity and trust assumptions. An issuer-based transfer can follow another process again.

L2s also differ in who operates the sequencer, who can upgrade the contracts, and what users can do if an operator stops responding. Relying on Ethereum does not make those details disappear. A network can also be compatible with Ethereum applications without being an Ethereum rollup at all.

Alice’s address has stayed the same, but the transfer changed where her 200 USDC are recorded. The bridge or issuer’s process connects the asset records; the rollup’s verification mechanism connects execution to Ethereum.

Lower fees make more activity practical, but they are only one part of that arrangement. What matters is where Alice’s assets are recorded, which version she holds, and which rules let her use them or leave the network.

Next, [\[ Oracles \] 101](/en/learn/oracles-101) returns to Bob’s loan to explain how contracts obtain prices and other external information.
