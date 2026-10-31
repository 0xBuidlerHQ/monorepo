---
title: "[ DeFi ] 101"
draft: false
---

Alice has sold ticket 42 to Bob for **0.6 ETH**. In [\[ Ethereum \] 101](/en/learn/ethereum-101), their program made the payment and the ticket transfer happen together.

She now wants to put that money to work. Instead of committing everything to one asset or service, she decides to split it: one part for staking through Lido, one for lending through Aave, and one for a project token she likes.

These choices lead into **decentralized finance**, or **DeFi**: financial services built around smart contracts. We will follow what Alice does with her proceeds, what might generate a return, and what can go wrong. The amounts and exchange values are illustrative.

## Three uses for the proceeds

Alice divides her **0.6 ETH into three parts of 0.2 ETH**. She will keep the first part exposed to ETH through staking, exchange the second for a dollar-tracking stablecoin to lend, and use the third to buy the project token.

Each service is governed by a **[protocol](/en/glossary#protocol)**: the rules and contracts implementing it. The app Alice uses helps prepare her requests; the contracts record her position and determine what can happen to the assets.

This split separates potential staking rewards, loan interest, and a change in the project token’s price. We will follow each part.

## Swaps and liquidity pools

For the lending part, Alice first exchanges **0.2 ETH for 500 USDC**. USDC is a **[stablecoin](/en/glossary#stablecoin)** designed to track the US dollar. Exchanging one asset for another is a **[swap](/en/glossary#swap)**.

The USDC must come from somewhere. In a pool-based exchange, other participants deposit assets into a contract that makes them available for swaps. These deposits form a **[liquidity pool](/en/glossary#liquidity-pool)**; the depositors are **liquidity providers**. Here, they make assets available so Alice can exchange ETH for USDC.

When the swap succeeds, the pool receives Alice’s input asset and sends USDC to her address. Part of the trading fee goes to the liquidity providers because their assets made the exchange possible. Services such as Uniswap use pools this way.

Supplying liquidity is therefore another way to seek a return: fees from trades that use the supplied assets. But trades also change the assets in the provider’s position. Fees may not compensate for losses compared with simply holding the original assets. Alice uses the pool to exchange her money; in this example, she does not become a liquidity provider herself.

## Staking ETH with Lido

Alice commits her first **0.2 ETH** through Lido. To understand the possible return, we need to look at what those ETH help do.

Ethereum uses **[staking](/en/glossary#staking)** to secure its network. Validators commit ETH and participate in proposing and checking blocks. Correct participation can earn rewards; failures and certain rule violations can lead to penalties. The rewards compensate participation in the network’s security, rather than interest paid by a borrower.

Lido pools ETH from users and routes it to validators operated by participating node operators. Alice can take part without running a validator herself. Through its pooled staking service, she receives **stETH**, a token representing her share of the pooled staked ETH and its results. Her stETH balance adjusts to reflect allocated rewards or penalties, after the protocol’s fee.

Because that position is represented by a transferable token, this is called **liquid staking**. Alice can hold stETH, transfer it, or use it in compatible applications while the underlying ETH participates in staking.

The token does not make the underlying stake instantly withdrawable. Returning through Lido’s withdrawal process can involve waiting. Selling stETH on a market is another route, at the price buyers will pay. Alice still faces ETH price movements, as well as validator and smart-contract risks.

## Lending USDC through Aave

Alice supplies the **500 USDC** from her swap to **Aave**, a lending protocol. Her deposit is in USDC; Aave is the service that makes those assets available to borrowers and records her claim on the pool.

Borrowers pay interest, part of which goes to suppliers such as Alice. The rate changes with borrowing demand and the assets available. Her return comes from lending, unlike the network rewards behind her stETH.

Suppose Bob wants to borrow **400 USDC** without selling his remaining ETH. He supplies **0.4 ETH**, valued at **1,000 dollars** in this example, as **[collateral](/en/glossary#collateral)**. This resembles a Lombard loan in traditional finance: borrowing against assets rather than selling them. The protocol’s rules determine whether his collateral supports the requested loan.

Bob receives USDC from the lending pool and owes that amount plus interest. If his collateral loses too much value relative to his debt, the position can be **[liquidated](/en/glossary#liquidation)**: another participant repays debt and receives some of his collateral under the protocol’s rules. This protects the pool by enforcing the backing of loans, although it cannot eliminate every possible loss.

Alice does not personally select Bob or negotiate his rate. She supplies to a shared market. She can request a withdrawal, but receiving her assets depends on sufficient available liquidity. Her position also depends on Aave’s contracts and on USDC maintaining its intended value.

## Buying a project token

With her final **0.2 ETH**, Alice buys the token of a project she follows. The same kind of swap can exchange her ETH for that token.

Suppose the project uses its token to let holders vote on some decisions or access a service. Those uses may make it interesting to Alice, but they do not automatically make it a share in a company or a right to receive profits. The rights depend on the project’s actual rules.

Her main expectation here is that the token’s price could rise. If she later sells it for more than she paid, she realizes a gain. Simply holding it does not automatically generate interest or staking rewards, and the price can fall even if the project continues to operate.

## Understanding the return

Alice can now ask where each potential gain comes from. The source is Ethereum’s validator activity for staking, borrowers for lending, and future buyers’ willingness to pay for the project token. Liquidity providers, meanwhile, receive trading fees.

A displayed **[APR or APY](/en/glossary#apr-and-apy)** expresses a rate over a year; APY includes reinvested earnings. A variable rate is not a promise of the same return for an entire year.

There is a second question: return measured in what? Alice’s stETH balance could increase while ETH falls in dollar value. Her USDC balance could earn interest while each USDC trades below its intended dollar value. More units and a higher total value are not necessarily the same outcome.

## Diversifying without losing the thread

Alice has turned one payment into three positions: staked ETH represented by stETH, a USDC lending position, and a project token. She can identify what each one represents, what might generate a gain, and how she could exit it.

Spreading the money reduces dependence on a single position, but it does not make the positions independent. They still share dependencies on Ethereum and smart contracts, and crypto asset prices can fall together. Lido and Aave also have their own rules and administrative arrangements; using an open network does not remove the need to understand the services built on it.

DeFi lets Alice combine these services using assets and programs on a shared network. The useful habit is to follow what her money is doing: securing a network, funding borrowers, supplying exchanges, or buying an asset in the hope of a price increase. Each activity has its own source of return and its own way to lose money.

Next, [\[ Stablecoins \] 101](/en/learn/stablecoins-101) examines what connects Alice’s 500 USDC to the 500 dollars they are intended to represent.
