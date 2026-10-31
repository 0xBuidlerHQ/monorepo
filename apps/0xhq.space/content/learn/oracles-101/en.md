---
description: "Learn how blockchain oracles bring outside data to smart contracts, how price feeds work, and why data quality matters for DeFi loans."
title: "[ Oracles ] 101"
draft: false
---

In [\[ DeFi \] 101](/en/learn/defi-101), Bob borrowed 400 USDC against assets worth 1,000 dollars. His position could be liquidated if that backing lost too much value.

But the contract records tokens, not dollar price labels attached to them. How does it know what Bob’s ETH are worth? Which price should it use when different markets show different numbers?

This is the role of an **oracle**: providing information that a contract needs but cannot establish from its own records alone. We will follow one price from the market to Bob’s lending position. All prices and risk parameters in the example are illustrative.

## What the contract can and cannot know

The lending contract can read how many tokens Bob has supplied and how much he owes. Those amounts are part of the blockchain’s records. Their current dollar values are a different input.

It cannot simply ask every node to open a website and use whatever price appears. Websites can change between requests, become unavailable, or return different answers. Nodes processing the same transaction need agreed inputs to obtain the same result.

An **[oracle](/en/glossary#oracle)** connects a source of information to the application using it. For a price oracle, that may include collecting market observations, combining them, and delivering a report that the contract can check and use.

## From market observations to a reference price

Suppose Bob’s collateral is **0.4 ETH**. At a reference price of **2,500 dollars per ETH**, the lending protocol values it at **1,000 dollars**.

There is no single universal ETH price written somewhere in the world. Different trading venues can show slightly different prices, and their liquidity and activity differ. A price feed needs a method for deciding which observations to include and how to combine them.

For a simple illustration, suppose three accepted observations are **2,490, 2,500, and 2,510 dollars**. A system taking the middle value, called the **median**, would report 2,500 dollars. This makes one unusually high or low observation less influential than simply accepting a single source. It does not make every group of sources trustworthy.

Oracle networks such as **Chainlink** can combine information at several stages, including data providers and reporting nodes. The exact method depends on the feed. Other designs use prices already recorded in onchain markets, sometimes averaged over a period.

What matters is the independence and quality of the inputs. Ten reporters copying one unreliable source do not provide ten independent views. A price from a small market that is easy to move can also be unsuitable for valuing a much larger loan.

## Publishing a price the contract can use

In one common arrangement, reporting participants submit price updates to an oracle contract. The system checks that a report meets its authorization and acceptance rules. A feed contract then makes the accepted answer available to other contracts.

When Bob borrows, repays, or faces liquidation, the lending protocol reads its configured feed and uses that answer to value the relevant assets. The price displayed on Bob’s screen is not necessarily the price that the contract uses.

Aave, for example, uses oracle infrastructure to obtain asset values for its lending markets. The selected feeds and any additional pricing logic are part of the protocol’s configuration. Not every asset must use the same type of price or exchange-rate feed.

Other oracle designs deliver a signed report with the transaction that needs it, rather than relying only on a previously published answer. In either arrangement, the application must know which reports it accepts and how to interpret them.

A valid report signature identifies an authorized reporter. It does not, by itself, prove that the reported market price is correct.

## A price also has a time

Suppose the last accepted ETH price was 2,500 dollars, but the market has since fallen sharply. A correctly signed old report can still be a poor basis for a new loan.

A feed therefore needs more than a number. Information about when it was updated helps the application decide whether it is fresh enough to use. Some feeds, including many Chainlink price feeds, trigger updates when the price moves sufficiently or when a configured time interval has elapsed. That does not mean every market movement instantly appears onchain.

The lending application needs rules for reports that are missing or too old. It may reject an operation or pause part of its service rather than continue with a price outside its accepted conditions. The suitable limits depend on the asset and the application.

A network disruption can matter too. On a Layer 2, a sequencer outage may prevent users from acting while markets elsewhere continue to move. Applications can check network-status information and allow a recovery period before resuming sensitive operations. The price and the conditions in which users can react to it both matter.

## How a price affects Bob’s loan

Return to Bob’s **0.4 ETH** and **400 USDC debt**. For this calculation, assume USDC is worth one dollar and the position has an **80% liquidation threshold**. This illustrative threshold determines when liquidation is allowed; it is not the limit for taking out a new loan or a statement of Aave’s current settings.

At 2,500 dollars per ETH, the collateral is worth 1,000 dollars. Eighty percent of that is 800 dollars, so the 400-dollar debt is below the liquidation boundary.

If the accepted price falls to **1,200 dollars per ETH**, the contract values the collateral at **480 dollars**. Eighty percent is **384 dollars**, below the 400-dollar debt. Under our rule, the position is now eligible for liquidation.

The oracle supplied the price. The lending contract applied the loan rule. A participant can then submit a liquidation transaction; the price update does not mean the oracle itself takes Bob’s ETH.

An incorrectly low price can make an adequately backed position appear eligible for liquidation. An incorrectly high one can allow excessive borrowing or delay liquidation while losses grow. A protocol also needs to value the borrowed asset: assuming every USDC is always worth one dollar can become wrong during a depeg.

Source selection, update timing, and correct configuration therefore affect real assets. Even a correct price in the wrong currency or for the wrong token can produce an incorrect result if the application interprets it badly.

## Where the trust sits

A lending contract can apply its rules exactly and still produce harmful outcomes from bad inputs. Distributing execution among many computers does not remove the need to examine where those inputs come from.

Multiple independent sources, robust aggregation, freshness checks, and limits on unusual values can reduce particular risks. None turns the oracle into a universal guarantee of truth. Some systems also give administrators power to replace a source or pause its use, adding another dependency.

The same principle extends beyond prices. A ticket program could use an oracle report about a concert cancellation to apply a refund rule. It would still depend on who is trusted to report that cancellation and what the contract does with the report.

Bob’s loan makes the distinction concrete: the blockchain records his collateral and debt, the oracle provides the valuation input, and the lending contract decides what that input means for his position. Understanding an oracle means following that full path, rather than treating a number inside a contract as a fact the blockchain discovered for itself.
