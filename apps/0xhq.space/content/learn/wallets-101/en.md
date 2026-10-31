---
description: "Understand crypto wallets, accounts, private keys, signatures, permissions, and recovery by following Alice as she uses her ETH."
title: "[ Wallets ] 101"
draft: false
---

Alice has received 0.6 ETH from selling ticket 42. In [\[ Ethereum \] 101](/en/learn/ethereum-101), we followed what the network and the ticket contract did. Now she opens an application to use her proceeds.

The site asks her to connect a wallet. A moment later, the wallet displays a request to sign. Does connecting give the site control of her money? Does every signature move assets? What if she loses her phone?

These questions are about the boundary between Alice’s account, her wallet, and the applications asking for permission to act.

## The wallet and the account

The previous articles established that assets are recorded on the blockchain and keys authorize actions. A **[wallet](/en/glossary#wallet)** makes that relationship usable: it displays an account’s assets, prepares requests, and arranges for authorized signatures.

Alice’s account is the identity the network uses to record her ETH. Her wallet is the tool through which she accesses it. Uninstalling the tool does not delete the account or remove its balance from Ethereum.

This also explains why two compatible wallet apps can show the same account. They are reading the same record and using the same signing authority, not creating two copies of the money.

For the rest of the example, Alice uses a wallet where she controls the keys herself. This is called **self-custody**. It gives her authority to act without a platform approving each withdrawal, but also makes protecting and recovering that authority her responsibility.

## Connecting to an application

Alice selects “Connect wallet.” The wallet asks which account she wants to share with the site. An ordinary connection lets the application learn that address and request interactions through the wallet.

Connection alone does not authorize a transfer, reveal the private key, or grant permission to spend tokens. A site can read public blockchain information associated with an address once it knows it; disconnecting cannot make that public record private again.

If the application then wants Alice to sign a message, send a transaction, or grant another permission, that is an additional request. Some interfaces bundle several steps, so the wallet prompt matters more than the wording on the website’s button.

## Signing a message or sending a transaction

An application may ask Alice to sign a message to log in. A well-scoped login message identifies the service and the purpose of the request, with information that limits reuse, such as an expiry and a one-time value. The signature lets the service verify control of the account.

A **transaction** instead asks the network to process an operation. Alice’s ticket listing was one such operation. The wallet prepares its destination, any attached ETH, and the instructions sent to a contract, then asks her to authorize it.

The distinction does not make all message signatures harmless. Some signed messages authorize an order or a spending permission that another participant can later submit to a contract. Alice may be giving away authority even though her wallet is not currently sending a transaction.

She therefore needs to understand the purpose, recipient, amount, and scope of what she signs. “Sign in,” “approve spending,” and “transfer assets” can all produce a wallet prompt while authorizing very different things.

## Token spending permissions

Suppose an application needs to take payment tokens from Alice’s account as part of an operation. Rather than giving it her key, she can grant a specific contract an **[approval](/en/glossary#approval)** to spend a particular ERC-20 token up to a specified amount.

An allowance of **100 units** lets that spender transfer up to that amount under the token’s rules. In a conventional ERC-20 allowance, spending 60 leaves 40. The approval does not itself deposit the tokens into the application; it establishes permission that can be used later.

Some interfaces request a very large allowance so users do not need to approve every future operation. That also leaves the spender with broader authority. Alice needs to distinguish the amount she intends to use now from the amount the contract is authorized to take.

The spender is a contract address, not simply a website name. A malicious spender, or a vulnerable contract with spending authority, can put the approved tokens at risk. Some tokens allow spending permissions through signed messages, so this authority can also appear in a signature request.

Disconnecting the website does not cancel an onchain allowance. Alice must **revoke** or reduce it through the token’s permission mechanism. Permissions for tickets and other NFTs follow their own rules and can sometimes cover an entire collection rather than a numerical balance.

## Recovery phrases and lost devices

Many self-custody wallets generate a **[recovery phrase](/en/glossary#recovery-phrase)**, often 12 or 24 words, from which signing keys and accounts can be reconstructed. It is a backup of control over those accounts, not a list of tokens stored inside the app.

If Alice loses her phone but has the required recovery information, she can restore access with a compatible wallet. Restoring the same keys does not disable the lost device: if it can still sign, it retains that authority.

Her app password or device PIN usually protects local access, rather than replacing the recovery information on another device. Someone with the phrase and any required additional secret can regain signing authority without that password; changing the app password does not invalidate the phrase.

That is why Alice keeps the recovery information separate from the device it recovers and does not enter it into an application simply to connect or log in. A site that receives it may gain control of the accounts, not just permission for one operation.

If the only signing access and its backup are both lost, there may be no way to recover the account. Other wallet designs use different mechanisms, such as multiple signers or recovery contacts; not every wallet relies on a phrase, and its actual recovery rules matter.

## Software, hardware, and platform accounts

A **software wallet** runs on a phone or computer. With keys stored on that device, it can conveniently prepare and sign requests, while depending on the security of the device and wallet software.

A **hardware wallet** separates signing into a dedicated device. A compatible app prepares the request, while the hardware device holds the keys and signs after Alice confirms. In normal operation, the app receives the signature rather than the private key.

This helps reduce exposure to a compromised computer, but does not make an authorized request safe. A hardware wallet can still sign a harmful transfer or spending permission. Alice needs to review what the device can display, and its recovery information remains sensitive.

An account on a **custodial platform** works differently. The platform controls the keys for the assets it holds and records what it owes Alice. Her password lets her ask the platform to act; it does not necessarily give her direct signing control over an Ethereum account. Recovery and withdrawals depend on the service’s rules and availability.

## What Alice authorizes

Alice can now distinguish the steps in an application interaction. Connecting shares an account with the site. A login signature can establish control of that account. A token approval grants spending authority to a specific spender. A transaction asks the network to execute an operation.

Those permissions can outlive the page that requested them, while the recovery mechanism determines who can regain overall control of the account. Her wallet helps her inspect and authorize requests; it does not guarantee that the site’s promises match what its contracts will do.

With these distinctions in place, Alice can look at financial applications without treating every wallet confirmation as the same action. Next, [\[ DeFi \] 101](/en/learn/defi-101) follows how she divides her ticket proceeds between staking, lending, and a project token.
