---
title: "All Software Engineers Are Developers, Not Vice Versa"
date: "2026-11-27"
description: "Why the difference between developing software and engineering systems has nothing to do with job titles and everything to do with what happens after the code works."
tags:
- engineering
- career
- thoughts
draft: false
unlisted: false
---

Someone asked me what I thought about the saying: *all software engineers are developers, but not all developers are software engineers.*

On paper, it sounds like gatekeeping. In practice, once you spend enough time shipping things and watching them break, you realize it is just describing two different jobs that happen to use the same keyboard.

## Making It Work vs. Keeping It Working

When I started building tools, my only goal was getting the logic to run. If the script parsed the file, hit the endpoint, or printed the right output on my machine, I was done. That is **development**—turning an idea or a requirement into working code.

**Engineering** starts the moment you ask what happens when things go wrong.

Take a simple TCP check. Writing a function that opens a connection and returns `nil` takes five minutes. Engineering that same check into a CLI people rely on in CI means asking different questions:

* What happens when DNS hangs instead of refusing the connection?
* Are we leaking file descriptors if a loop retries a thousand times?
* Does the exit code tell a pipeline whether the host was unreachable or the input flag was wrong?
* Will this binary still build cleanly two years from now without pulling in thirty transitive dependencies?

You can write great, useful software without spending your days thinking about failure modes, contention, or long-term maintenance cost. Plenty of good developers do. What you cannot do is engineer reliable systems if you do not know how to write clean, working code first.

## Titles Lie Anyway

In the real world, job titles blur the line completely.

I have seen people with "Developer" on their profile quietly holding together production databases, deployment pipelines, and security boundaries by themselves. I have also seen "Senior Software Engineers" spend months wiring basic CRUD endpoints without ever thinking about how the system behaves under load.

A title on LinkedIn does not make you an engineer, and building small tools does not make you "just" a developer.

## Where I Sit

I do not have a corporate title. I build from Lagos, mostly in Go and Python, shipping small open-source utilities because I enjoy solving problems I notice; and cleanly.

Some days I am purely in developer mode—hacking together a prototype just to see if an idea holds water. Other days, when people actually start depending on a tool, I have to put the engineering hat on and worry about edge cases, predictable failures, and keeping the codebase small enough to maintain alone.

You need both. Build the thing first so it exists. Engineer the edges once it matters.
