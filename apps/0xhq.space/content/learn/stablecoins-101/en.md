---
title: "[ Stablecoins ] 101"
draft: false
---

In [\[ DeFi \] 101](/en/learn/defi-101), Alice exchanged part of the ETH from her ticket sale for 500 USDC. We then treated those units as worth 500 dollars. Return to those tokens before Alice supplies them to the lending protocol.

Her wallet can confirm that she holds 500 tokens. But who makes them worth 500 dollars? Could someone write “one dollar” into a contract and give any token that value?

A token’s balance and its price are different things. To understand Alice’s money, we need to follow the connection between the tokens she holds and the dollars they are meant to track.

## A reference value

A **[stablecoin](/en/glossary#stablecoin)** is a token designed to track a reference value. For a dollar stablecoin, the usual target is one US dollar per unit. Other stablecoins track currencies such as the euro. The reference value a token aims to maintain is called its **peg**.

This makes a dollar stablecoin useful for pricing a ticket, making a payment, or expressing a debt without choosing a currency whose price fluctuates like ETH. A price of 500 units is intended to remain close to 500 dollars.

That target does not set the price automatically. If Alice sells her tokens, she receives what buyers are willing to pay. Keeping that price close to the target requires a mechanism that gives people a reason to exchange the token near one dollar.

“Stable” is also relative to the reference currency. A token that tracks the dollar can change in euro value when exchange rates move, and the dollar’s purchasing power can change over time.

## Reserves and redemption

One common model uses an issuer that holds assets outside the blockchain to back the tokens it creates. Those assets are its **reserves**. They can include bank deposits and short-term government debt, rather than only cash sitting in an account.

In a simplified example, an eligible customer sends 500 dollars to the issuer. The issuer adds that value to its reserves and creates 500 tokens. Creating units is called **minting**. The tokens can then circulate between wallets and applications without another bank transfer each time they change hands.

When an eligible holder returns 500 tokens for 500 dollars, this is **redemption**. The redeemed tokens are removed from circulation, or **burned**, as the corresponding payment is made. Issuance and redemption connect the number of tokens to the assets backing them.

Alice acquired her tokens through a swap, so her purchase did not necessarily create new tokens or add dollars to the issuer’s reserves. It transferred existing tokens from the pool to her address. Supplying them to a lending protocol likewise makes existing tokens available to borrowers; it does not create another reserve of dollars behind them.

Direct redemption depends on the issuer’s terms and the holder’s eligibility. Alice may instead sell through an exchange or another service. Holding a token does not, by itself, tell her which route to dollars is available to her.

## How the market price stays near one dollar

Suppose the reserve-backed token trades at **0.98 dollars** while eligible traders can still redeem it for one dollar. One of those traders could buy 500 units for 490 dollars and redeem them for 500 dollars. The ten-dollar difference is a potential gain before costs.

Buying the discounted tokens creates demand for them, while redemption removes units from circulation. Both can help bring the market price back toward one dollar.

The opposite opportunity can appear if the token trades at **1.02 dollars**. A participant able to create 500 units for 500 dollars could sell them for 510 dollars. Issuing and selling tokens adds supply, helping bring the price down.

Trading to benefit from such a price difference is called **arbitrage**. Alice does not need to perform it herself for other participants’ activity to help support the peg.

The important condition is that the opportunity must actually be usable. If redemption is blocked, too slow, or no longer trusted, a low price may not attract enough buyers. The peg depends on functioning access to reserves, not just on an issuer declaring a target.

## Different ways to back the same target

Not every dollar stablecoin uses a company holding dollar assets in bank and investment accounts.

Another design lets participants lock accepted crypto assets into contracts and create stablecoins against that collateral. Unlike Alice’s Aave deposit, which lends existing USDC, this operation issues new units.

The system commonly requires more collateral value than the stablecoins issued, with price feeds and liquidation rules helping maintain that backing. Repaying the issued debt removes the corresponding units from circulation and releases the collateral under the protocol’s rules.

Some designs also use reserve-backed stablecoins as collateral, carrying their issuer dependencies into the new token.

Other designs, often called **algorithmic stablecoins**, try to support the target mainly through supply adjustments or conversion into another token, rather than sufficient independent reserves. If that other token loses value when confidence falls, the mechanism can weaken just as holders try to exit. Code that adjusts supply does not create assets with which to repay everyone.

Real systems can combine these approaches. A few examples show how tokens with similar targets can rely on different backing:

- **USDC**, the token Alice holds, is issued by **Circle** and targets one dollar. Its backing includes bank deposits and short-term US government debt: it follows the issuer-and-reserves model described above.
- **USDT**, issued by **Tether**, also targets one dollar. It uses an issuer-held reserve model too, but with a different issuer, reserve composition, and redemption terms. USDT and USDC therefore do not represent the same backing simply because both target the dollar.
- **DAI and USDS** belong to the **Sky** ecosystem, formerly MakerDAO. They target the dollar through a collateral-backed protocol; DAI can be converted into USDS at a one-to-one ratio. The backing is not limited to ETH and can include other stablecoins and exposure to assets outside the blockchain.
- **USDe**, from **Ethena**, is a synthetic dollar. It combines backing assets with financial positions designed to offset crypto price movements. Its stability therefore also depends on those positions and the trading venues used, rather than simply a reserve of dollars.
- **EURC**, also issued by **Circle**, targets **one euro** and uses euro reserves. Its main difference from USDC is the reference currency: one EURC is not intended to equal one dollar.

## When the peg breaks

Imagine that holders doubt whether the reserves are sufficient or whether redemptions will be processed. More people try to sell the token, while fewer are willing to buy it near one dollar. Its price can fall below the target. A significant departure from the peg is called a **depeg**.

If Alice still holds 500 units and the market price falls to **0.90 dollars**, they are now worth about **450 dollars** at that price. The blockchain may continue to record exactly 500 units. It has not failed to count them; their exchange value has changed.

A depeg can be temporary, for example when access to banking or redemption is disrupted, or reflect a lasting shortfall in backing. Recovery is not automatic. Even adequate assets on paper may be hard to turn into payments quickly during a rush to redeem.

The same distinction matters for Bob’s loan. Owing 400 units of a stablecoin means owing those units under the protocol’s rules, not automatically owing a permanently fixed 400-dollar amount. A depeg changes their market value and can affect the positions of borrowers and suppliers.

## What Alice actually holds

Alice’s 500 tokens give her a transferable asset that aims to follow the dollar. They are not simply 500 dollars moved from a bank account into a wallet.

With a reserve-backed token, her confidence depends on the issuer’s assets and the routes through which holders can obtain dollars. Reserve reports help describe the backing, but Alice’s onchain balance alone cannot prove that those assets exist or can be accessed. Some issuers can also freeze transfers from particular addresses through administrative powers in the token contract.

The reference value, the backing, and the market price are three separate pieces that need to keep working together.

That is what was hidden inside the phrase “500 stablecoin units.” The blockchain records how many Alice holds. The stablecoin’s design gives people reasons to value each unit near a dollar. The strength of that connection determines how well those 500 units can serve as 500 dollars in her next payment, exchange, or loan.

Next, [\[ Layer 2 \] 101](/en/learn/layer-2-101) follows Alice’s USDC across networks to explain rollups and bridges.
