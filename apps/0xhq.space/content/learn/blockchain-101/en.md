---
description: "Understand how blockchains work through a concert ticket: transactions, digital signatures, blocks, consensus, and finality explained step by step."
title: "[ Blockchain ] 101"
draft: false
---

Alice owns ticket 42 for a concert. She cannot attend, so she wants to give it to Bob. If she sends him a photograph, she still has the original image. She could send another copy to Charlie too.

Which person should the venue admit?

The image cannot settle that question. A digital file can be copied without taking it away from its previous holder. To transfer a ticket, we need a record of ownership and a way to agree on its changes.

Let’s follow this ticket to understand how a blockchain can provide that record.

## A shared ownership record

A conventional ticket company can keep a database saying “ticket 42 belongs to Alice.” When she gives it to Bob, the company updates the entry. Alice may still possess an image, but the company now recognizes Bob as the owner.

This can work well. It also gives one organization authority over the record. Customers and other ticket apps depend on it to report ownership accurately and accept legitimate transfers.

Suppose several independent apps want to use the same record without giving any one of them sole control. Each could keep a copy, but copies alone do not determine which changes to accept. One app might record a transfer to Bob while another records a transfer to Charlie.

The participants need common rules for checking requests and agreeing on a history. A **[blockchain](/en/glossary#blockchain)** combines a shared record with rules for maintaining it across a network of computers. Our example uses a blockchain that supports programs; the available features and participation rules vary between networks.

## Transactions and digital signatures

The record identifies Alice’s **[account](/en/glossary#account)** as the ticket’s owner. Accounts use identifiers called **[addresses](/en/glossary#address)**. Bob shares his address so Alice can specify the recipient. The names Alice and Bob make the example readable; an address does not, by itself, reveal someone’s identity.

Alice requests: “Transfer ticket 42 to Bob’s address.” This instruction is a **[transaction](/en/glossary#transaction)**. Submitting it asks the network to process a change. It does not immediately make Bob the owner.

But anyone could write that instruction. To show authorization, Alice’s account uses two mathematically related keys. Her **[private key](/en/glossary#private-key)** is secret and creates signatures. The matching **[public key](/en/glossary#public-key)** lets others verify them.

Her **[wallet](/en/glossary#wallet)** helps her review the request and use her key to create a **[digital signature](/en/glossary#digital-signature)** over its details. The network checks both the signature and whether the signing key is authorized for her account. Her private key does not need to be sent with the transaction.

The signature is tied to what she signed. Replacing Bob’s address with Charlie’s changes the request, so that signature no longer verifies. Knowing Alice’s public key does not make it practical to sign new requests in her place.

The wallet provides access to the ticket; ownership is recorded in the shared system. If someone steals Alice’s private key, they can sign as her account. The network checks authorization by the key, not whether the person using it is really Alice.

## Smart contracts and nodes

A correctly signed request still needs to follow the ticket’s rules. Alice must own ticket 42 when the transfer is processed. Signing a request does not give her permission to transfer someone else’s ticket.

Some blockchains allow developers to write programs that define an application’s rules. Such a program is called a **[smart contract](/en/glossary#smart-contract)**. Its code and stored information form part of the shared system. Our ticket program checks the current owner before recording the recipient as the new owner.

Computers participating in the network are called **[nodes](/en/glossary#node)**. Nodes that fully verify the rules check proposed changes themselves, including authorization and the program’s execution. Given the same starting record and ordered requests, they must obtain the same result. They reject a proposed update that skips a required check or invents an unauthorized transfer.

Independent checking contributes to **[decentralization](/en/glossary#decentralization)**: distributing responsibility and control among participants. How independent those participants actually are matters. Many computers run by one organization can still leave that organization with substantial control.

## Blocks and hashes

The participants need to propose a precise next sequence of events. They group transactions into ordered batches called **[blocks](/en/glossary#block)**. Each proposed block identifies the previous block it builds on. Its transactions are processed from the record produced by that earlier history.

Alice’s transfer might appear in one such block. If it succeeds, the current record shows Bob as owner. The history still shows how the ticket reached him; changing the current owner does not erase previous transfers.

To connect the blocks, the system uses a **[hash](/en/glossary#hash)**: a digital fingerprint calculated from data. Identical data produces an identical hash. Changing the data almost certainly changes the fingerprint. A suitable cryptographic hash makes it impractical to deliberately find different data with the same fingerprint.

A block’s fingerprint depends on its contents, including its reference to the previous block. Altering an earlier transaction therefore changes the fingerprints connecting it to later history. The old references no longer match: the links make alterations detectable.

Someone could recalculate the affected fingerprints to create a different, internally consistent history. Hashes reveal that it differs from the original; they do not decide which history everyone should accept. The network needs another mechanism for that decision.

## Consensus and finality

Suppose Alice signs one request giving ticket 42 to Bob and another giving it to Charlie. Both signatures are genuine. Each request could succeed if considered first, while Alice still owns the ticket.

Once one transfer succeeds, however, Alice no longer owns it. Her other request cannot successfully transfer the same ticket. The rules prevent both transfers from succeeding in one history, but they do not tell different computers which request comes first.

Why not use arrival time? Messages take time to travel. One node can receive Bob’s transfer first while another receives Charlie’s first. Both can follow the ownership rule yet reach different conclusions about the owner.

The network therefore needs rules for choosing between competing proposals and establishing a common history. This is **[consensus](/en/glossary#consensus)**. Participants can propose different blocks based on the same earlier history; consensus determines which valid branch to continue.

Verification and consensus answer different questions. Verification checks that a proposed history follows the rules. Consensus establishes which valid history the participants accept. Selecting a block cannot make a forged signature valid for nodes that check it.

Networks use different methods to select block producers and resist manipulation. Some tie participation to computational work or committed assets; others restrict it to approved participants. Their security depends on those rules and on the distribution of control. Agreement is not guaranteed under every attack or network failure.

Bob also needs to distinguish seeing a recent transfer from treating it as settled. A recent block can be replaced if the network chooses another branch. **[Finality](/en/glossary#finality)** describes the assurance that an update is settled; its conditions and strength depend on the network. Bob’s app can show progress toward that assurance.

## The transaction lifecycle

Assume the ticket program permits Alice’s transfer. The network in our example charges transaction fees, which pay for processing and help make flooding it with requests costly.

1. **Prepare.** Alice selects ticket 42 and Bob’s address. Her app constructs a transaction asking the ticket program to transfer it.
2. **Sign.** Her wallet displays the request and arranges for her key to sign it. Ownership has not changed yet.
3. **Submit.** The signed transaction reaches a node and can spread through the network. Submission does not guarantee inclusion.
4. **Process and verify.** A participant includes it in a proposed block. Fully verifying nodes check the block and its execution. If Alice still owns the ticket and the transfer succeeds, the resulting record identifies Bob as owner.
5. **Establish the result.** Consensus determines whether the block belongs to the accepted history. Bob waits for the settlement assurance provided by the network.

Bob’s app can now show both the recorded owner and whether the transfer has reached the network’s settlement assurance.

## Applications, trust, and limitations

Their apps can read the same ownership record and interact with the same ticket program. They can use different interfaces without creating different tickets. The shared rules continue to apply regardless of which app prepares the request.

That makes the record useful beyond one website. But an interface can still display stale information or misrepresent what a signature authorizes. A shared network does not make every application trustworthy.

The ticket also illustrates a boundary. The record can establish ownership according to its rules, but it cannot prove that the concert exists or force the venue to admit Bob. The organizer must recognize what the digital record represents.

Other limits remain. Public records can expose activity linked to an address. Programs can contain bugs or grant administrators special powers. A genuine signature can authorize a mistake, such as sending the ticket to the wrong address. Distributing verification also consumes computing, storage, and communication resources.

A blockchain is therefore one way to organize a shared record, not a requirement for every ticket system. If everyone accepts one organization’s authority, a conventional database may be simpler. The distinctive benefit here is allowing independent participants to maintain and check a common history without giving one app sole authority over it.

## The blockchain as a whole

Copying Alice’s image could never establish who should own the ticket afterward. The shared record supplies that answer through several parts working together: signatures establish authorization, the program defines allowed transfers, nodes check the processing, and linked blocks organize the history. Consensus and settlement rules determine which history Bob can rely on.

Bob can now check an agreed record of ownership rather than relying only on Alice’s claim or an image.

Next, [\[ Ethereum \] 101](/en/learn/ethereum-101) will explore how a specific network puts these ideas into practice.
