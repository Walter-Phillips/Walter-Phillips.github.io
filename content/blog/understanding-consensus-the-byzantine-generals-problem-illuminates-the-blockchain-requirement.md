---
title: "Understanding Consensus: The Byzantine Generals Problem illuminates the blockchain requirement"
summary: The Byzantine Generals Problem helps explain how decentralized networks can agree on the truth without a central authority, and why that matters for systems like Bitcoin and Solana.
publishedAt: 2026-02-26
tags:
  - consensus
  - blockchain
  - distributed-systems
---

_This post is part of a series on how everyday investors can understand the word "consensus" in the context of blockchain networks._

Consensus is a general stance held by a group, or the act of coming to a unified stance on something. In the context of blockchain networks, consensus is the act of deciding what the canonical truth of the blockchain is. Put simply: which transactions actually get added to the ledger, and which do not.

[The Byzantine Generals Problem](https://www.cs.cornell.edu/courses/cs614/1999sp/notes98/byzantine.html) is a classic game theory and distributed systems problem. It outlines the challenge of coming to consensus without a central authority. That makes it a useful way to understand how networks like [Bitcoin](https://bitcoin.org/en/) and [Solana](https://solana.com/) can agree on the state of the ledger even when participants have different incentives.

## Byzantium Is Under Siege, and We Are the Ones Attacking

The problem is easiest to imagine as a set of generals who need to attack a city at the same time but do not have a secure channel of communication. They cannot simply meet in person and confirm the plan. Some of their communication pathways may be compromised. The question is how they can still arrive at a shared decision.

## Becoming Tamper-Proof

The generals' solution is recursive message passing. Each general sends their proposed plan to the others, then forwards what they received, and so on. Over multiple rounds, the honest parties can identify compromised participants and converge on the majority view.

That produces what is often called a Byzantine Fault Tolerant system: a system that can keep functioning even when some participants are dishonest.

## How Is Bitcoin Byzantine Fault Tolerant?

Bitcoin solves the problem using [Proof of Work](https://www.investopedia.com/terms/p/proof-work.asp). Miners compete to solve computationally expensive puzzles, and the winner earns the right to propose the next block. Because this requires real-world resources like hardware and electricity, dishonesty becomes very expensive.

Every node independently verifies that the proposed block follows the rules. If someone tries to submit false information, the network rejects it. In practice, an attacker would need to control a majority of the network's computational power to manipulate the ledger.

## How Is Solana Byzantine Fault Tolerant?

Solana uses [Proof of Stake](https://www.investopedia.com/terms/p/proof-stake-pos.asp) together with [Proof of History](https://solana.com/news/proof-of-history) and [Tower BFT](https://docs.anza.xyz/implemented-proposals/tower-bft).

Proof of History provides a shared, verifiable timeline for the network. Tower BFT builds on that timeline by allowing validators to vote on transaction validity with increasing commitment over time. Validators have capital at stake, and dishonest behavior can be penalized through slashing.

As long as a sufficient supermajority of validators behave honestly, the network can maintain consensus and continue processing transactions securely.

## Conclusion

The Byzantine Generals Problem may have started as a thought experiment, but its implications are at the heart of how modern blockchain networks function. The problem asks how a group can agree on the truth when some members may be dishonest. Bitcoin answers that question with Proof of Work. Solana answers it with Proof of Stake, Proof of History, and Tower BFT.

Understanding the problem is a useful way to understand why blockchain networks can function at all without a central authority.

_Originally published for [Meridian](https://meridian.app/research/understanding-consensus-the-byzantine-generals-problem-illuminates-the-blockchain-requirement)._
