---
title: "[ Ethereum ] 101"
draft: false
---

In [\[ Blockchain \] 101](/en/learn/blockchain-101), Alice wanted to give ticket 42 to Bob. Now imagine she wants to sell it to him instead.

Sending the ticket and sending the money separately creates a problem. If Alice transfers first, Bob might never pay. If Bob pays first, Alice might keep the ticket. They want an exchange in which both things happen together.

We will put their ticket system on Ethereum and follow that sale. The shared record, signatures, and blocks work as described in the previous article. The new questions are what Ethereum lets their program do, what they can use as money, and why using the network costs something.

## Ethereum and shared programs

The organizer needs somewhere to publish its ticket program so that Alice, Bob, and their apps can use the same rules. Ethereum provides a public blockchain where developers can deploy smart contracts. Deploying means publishing a contract’s code and initial information through a transaction. The contract then has an address that apps can call.

Our ticket contract records ownership. The organizer also gives it a sale function: an owner can set a price, and a buyer can purchase the ticket at that price. These are rules the developer writes; Ethereum does not come with a built-in concert ticket service.

Ethereum defines the environment that executes those rules, called the **Ethereum Virtual Machine**, or **EVM**. Think of it as a common instruction set for running contracts, rather than one computer operated by the organizer. Nodes checking execution apply that same instruction set to obtain the same result.

## Ether, the native cryptocurrency

Alice and Bob need an asset the program can transfer as payment.

Ethereum has a built-in currency called **ether**, abbreviated **ETH**. The network’s own rules track ETH balances and allow transactions to transfer it. ETH is therefore Ethereum’s **native cryptocurrency**: it belongs to the underlying protocol, rather than being created by the ticket application.

You may also hear “native coin” or “native token.” Here, those expressions refer to ETH. Ethereum is the network; ether is its currency. Owning ETH does not mean owning shares in a company called Ethereum.

Alice lists ticket 42 for **0.6 ETH**, an invented price for our example. Bob needs enough ETH for both the purchase and the network fee, which we will calculate shortly.

ETH can serve as payment when a seller accepts it, but its purchasing power is not fixed. Alice’s 0.6 ETH is not a promise of a particular amount of euros or dollars. ETH also pays Ethereum’s transaction fees, and participants commit ETH through [staking](/en/glossary#staking) to help secure the network.

## Tokens and the ticket

The network tracks ETH, but it does not know what a concert ticket means. That meaning comes from the ticket contract.

A **[token](/en/glossary#token)** is an asset represented and managed by rules on a blockchain. For a contract-issued token, the contract records balances or ownership and defines how they can change. A wallet displays that information; it does not contain a separate object that gets physically moved.

Ticket 42 has its own identity. It may represent a particular seat; replacing it with ticket 43 might give Bob a different seat. A token whose individual identity matters is **non-fungible**. An **NFT** is a non-fungible token. A ticket system can use **ERC-721**, a standard interface for checking ownership and transferring individually identified tokens.

The contract’s address and the ticket’s identifier together identify our ticket. Another contract could also issue a token numbered 42 without creating the same ticket.

Money-like tokens work differently. If Bob pays 1,500 units of the same payment token, Alice generally cares about the amount, not which individual units he sends. Those units are **fungible**: interchangeable within that asset. **ERC-20** gives such tokens a common interface for balances and transfers. Standards let wallets and applications support many assets without learning a different interface for each one.

The organizer could accept a **[stablecoin](/en/glossary#stablecoin)**, a token designed to track a reference value such as the US dollar. Alice could then price the ticket at 1,500 units instead.

For our sale, Alice chooses ETH. **ETH is native to Ethereum; the ticket and an ERC-20 payment token are managed by contracts running on Ethereum.** A token does not need its own blockchain.

## Exchanging the ticket and the payment together

Alice uses the ticket contract to list ticket 42 for 0.6 ETH. We assume this custom contract includes the sale rules and permits resale.

Bob’s app prepares a purchase transaction addressed to that contract. It asks to buy ticket 42 and attaches 0.6 ETH as payment. The contract checks that Alice still owns the ticket, that her listing is active, and that Bob supplied the required amount. If those checks pass, its code transfers ownership to Bob and pays Alice.

These operations belong to one execution. If a required step fails, the transaction’s changes to ownership and payment are rolled back. Bob does not end up paying Alice while the same purchase leaves her with the ticket. This property is called **atomicity**: the exchange’s changes take effect together or do not take effect.

Contracts can also call other contracts, allowing a marketplace to combine payment and ticket transfers. This ability to compose contracts lets developers build services around existing assets. Such a marketplace needs the necessary permissions; knowing the token’s address does not let it take Alice’s ticket.

Atomicity applies to the programmed exchange. The sale still needs correct code and a venue that honors the ticket, as the previous article explained.

## Gas, the measure of execution

Bob’s purchase makes the network execute checks and update stored information. A more complicated purchase could require more work. Ethereum needs to measure that work and prevent a request from running without a bound. Charging for execution also makes consuming the network’s limited capacity costly, including for someone trying to flood it with requests.

**[Gas](/en/glossary#gas)** is the unit used to account for execution. Different operations have different gas costs. The purchase consumes gas as its instructions run; gas is neither the ticket’s price nor a second currency Bob buys.

His transaction specifies a **gas limit**, the maximum number of gas units it may consume. If execution needs more, it stops and the purchase’s changes are rolled back. His wallet estimates a suitable limit before submission. The limit is a ceiling, not a prediction that every unit will be used.

Reading the existing owner through an app normally requires no transaction fee from Bob, because it does not submit a change to Ethereum. Buying the ticket does.

## Gas fees and the price of the ticket

Gas measures execution; a **gas price** determines how much ETH each unit costs. For the ordinary purchase transaction here:

**Transaction fee = gas used × effective price per gas.**

Gas prices are often expressed in **gwei**. One gwei is one billionth of an ETH. Suppose the purchase uses **100,000 gas** at an effective price of **20 gwei per gas**:

**100,000 × 20 gwei = 2,000,000 gwei = 0.002 ETH.**

These are illustrative numbers, not a current quote or a fixed cost for buying tickets. Bob spends **0.6 ETH for Alice’s ticket, plus 0.002 ETH in network fees**. With 1.1 ETH beforehand, he has 0.498 ETH afterward.

The gas fee is paid in ETH on Ethereum’s main network even when the asset being transferred is a token. Paying for a ticket with a stablecoin would not remove that ETH fee. A service can cover it on Bob’s behalf, but someone still pays the underlying fee.

The effective gas price includes a **base fee**, set by the protocol and adjusted with demand, plus a **priority fee** for the validator proposing the block. A validator participates in Ethereum’s block proposal and agreement process. The base-fee portion is destroyed, or **burned**, rather than paid to the validator. Bob can set fee caps; a cap that cannot cover the required base fee can leave his transaction waiting. These are the fee rules his wallet uses to prepare its estimate.

Two things can therefore increase the fee: a program can consume more gas, or each unit can become more expensive when execution capacity is in greater demand. A more expensive ticket does not automatically require more gas.

## The completed sale

Alice first records her listing through a transaction. Bob then reviews his purchase: the correct ticket contract, ticket 42, the 0.6 ETH price, and an estimated fee.

When the purchase succeeds, Bob owns the ticket and Alice has received 0.6 ETH. He waits for the settlement assurance discussed in Blockchain 101. His wallet can display both his ETH balance and his ticket, although Ethereum’s native rules track the first and the ticket contract tracks the second.

Alice and Bob have used a program to connect payment and ownership. Ethereum supplies the shared execution environment, contracts define the assets and the sale, ETH provides native payment and network fees, and gas measures the execution those fees pay for.

Next, [\[ Wallets \] 101](/en/learn/wallets-101) examines how Alice connects to applications and what she authorizes through her wallet.
