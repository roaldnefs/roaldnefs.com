---
title: Building a Car Hacking Test Bench
date: 2026-01-04T00:00:00+02:00
type: post
authors:
  - Roald Nefs
tags:
  - featured
  - automotive
draft: false
featured: true
summary: Modern cars are computers on wheel, dozens of ECUs, multiple busses, wireless interfaces, and a threat model that keeps expanding. For the past few years I dipped my toes in the automotive security scene. It's now time to take a deep dive. So I bought a car.
---
## Introduction
Modern cars are computers on wheels: dozens of ECUs, multiple buses, wireless interfaces, and a threat model that keeps expanding. Over the past few years, I've dipped my toes into the automotive security scene. Now it's time to take a deeper dive. So I bought a car.

The goal of this project is to turn that car into a **portable car hacking test bench**, a self-contained platform for experimenting with CAN, LIN, diagnostics, firmware extraction, fault injection, and whatever else I end up curious about along the way.

This post marks the beginning of that journey. It's intentionally incomplete and will be updated as the project unfolds: hardware choices, mistakes, dead ends, tooling, wiring diagrams, attack ideas that work (and many that don’t), and the lessons learned along the way. Think of it less as a tutorial and more as a research log, one I'm making public in the hope that it's useful to others exploring automotive security.

## Mercedes-Benz W203 (C‑Class)
For this project, I bought a **Mercedes-Benz W203 (C‑Class)**. The W203 hits a sweet spot for a research platform: old enough to be affordable and mechanically approachable, yet modern enough to include multiple ECUs, CAN buses, and OBD diagnostics. Or at least, that's what I've been told. I rescued it from the salvage yard, so it’s already a victory in itself.

![Mercedes-Benz W203 (C‑Class)](/images/posts/2026/01/04/w203.jpeg)

| Information | |
| :-------- | :------- |
| Brand  | MERCEDES-BENZ |
| Model | C 180 KOMPRESSOR |
| First registration | 07/2002 |

It has just one problem... It won't start.

## Current State
At the moment, the car won't even allow the key to turn to contact. The Electronic Ignition Switch (EIS) appears unresponsive, even though the Electronic Steering Lock (ESL) had already been removed by the garage.

The key itself is at least partially functional: it can lock and unlock the car, suggesting that the key electronics and RF communication are working. Despite this, the car never transitions into a contact or ignition state. Pointing to a likely issue with the EIS or ESL. Both known weak points on this generation of Mercedes.

Both the ESL and EIS are components of Mercedes-Benz's electronic immobilizer system, known as the Fahrberechtigungssystem[^1]. Starting with the 1998 model year, Mercedes introduced Fahrberechtigungssystem 3 (FBS3), which integrates key authentication, steering lock control, and ignition authorization into a single, tightly coupled security system.

## Emulating the Electronic Steering Lock (ESL)
After a quick search online, I found several inexpensive Electronic Steering Lock (ESL) emulators available for around €10-€20. Given that the ESL is a critical component of the FBS3 system, emulating it seemed like a reasonable first experiment.

The garage had already tried an emulator without success, but that didn't necessarily rule the idea out. It could have been a faulty unit, an incompatible version, or simply bad luck. At the very least, it suggested the problem was worth reproducing and understanding myself.

My first instinct was the classic one: throw parts at the car and hope something fixes the problem. I bought an ESL emulator and plugged it in, hoping it would magically unblock the ignition.

As expected, it didn't work.

Lesson learned, early and cheaply. Blindly swapping parts without understanding the system rarely fixes anything, especially when dealing with immobilizers. Still, the failed attempt was useful: it confirmed that the issue likely runs deeper than a missing or malfunctioning ESL and pushed the project firmly toward analysis rather than guesswork.

With the ESL largely ruled out, attention now shifts to the Electronic Ignition Switch (EIS). A quick dive into YouTube and forum posts turned up multiple cases of W203s exhibiting similar symptoms. Often traced back to broken solder joints or failing connections inside the EIS itself.

That makes the next challenge clear: getting the EIS out of the car.

## To Be Continued...
  
The car hacking test bench is still under construction, and this page will be updated as the project evolves. Expect rough edges. Sections may be expanded, rewritten, or removed as assumptions change and new findings emerge.

This is not a finished guide, but a live research log published in the hope that it's useful to others exploring automotive security.


[^1]: By examining the model year and the key, I was able to determine that this Mercedes‑Benz W203 uses FBS3. More information is available here: https://ecu.de/wegfahrsperrensysteme-mercedes-benz-60.htm.