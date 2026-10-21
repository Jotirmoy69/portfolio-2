---
title: NestJS APIs that last
description: Practical notes on building NestJS APIs that stay clear after the first sprint, modules, contracts, and failure modes.
date: 2026-02-18
tags:
  - nestjs
  - apis
  - typescript
---

I work mainly with NestJS because it gives structure without pretending the hard parts of backend work go away.

APIs that last share a few habits.

## Contracts before cleverness

Name the use case. Define the request and response. Keep controllers thin. Put the real decisions in services that you can test and reason about.

If a new engineer cannot find where a rule lives in under a minute, the API is already accumulating debt.

## Failure is part of the design

Timeouts, retries, validation errors, and partial failures are not edge cases, they are the product. I design for them early: clear status codes, predictable error shapes, and logs that point to a cause instead of a mystery.

## Grow without rewriting

Start with a modular monolith when you can. Introduce queues, Redis, or Kafka when communication patterns demand them, not because a blog post said microservices are cool.

The goal is not to collect technologies. The goal is software that is reliable, understandable, and useful.
