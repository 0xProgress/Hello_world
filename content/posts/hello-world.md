---
title: "Hello, World: Building Small Tools That Punch Above Their Weight"
date: "2026-11-24"
description: "Why I focus on single-binary CLI utilities, explicit failure diagnostics, and shipping open-source software in public from Lagos."
tags:
  - go
  - cli
  - open-source
draft: false
---

Most developer tooling fails in one of two ways: it pulls in half the internet to solve a twenty-line problem, or it hangs silently when something goes wrong in CI.

This space is where I document what I am building, how individual tools are designed, and what breaks along the way[^1].

## Why Small Tools Matter

A good CLI tool does one job cleanly, exits with a predictable status code, and tells you _why_ it failed when a check times out.

```go
package main

import (
	"fmt"
	"net"
	"time"
)

func probe(addr string, timeout time.Duration) error {
	conn, err := net.DialTimeout("tcp", addr, timeout)
	if err != nil {
		return fmt.Errorf("probe %s failed: %w", addr, err)
	}
	return conn.Close()
}
```
