---
title: Training & Workshops
type: about
width: full
toc: true
---
I run hands-on workshops on **automotive security** and **hardware hacking**. They're the kind of sessions I'd want to attend myself: short on slideware, long on probes, packets, and breaking things you actually own. Sessions are tailored to the audience, from a one-hour primer to a full day in the lab.

<figure class="home-feature">
  <div class="home-feature-images">
    <img src="/images/training/car-hacking-village-bsides-luxembourg-2026.jpeg"
         alt="Attendees at the Car Hacking Village booth at BSides Luxembourg 2026, with instrument clusters and laptops on a workshop table."
         loading="lazy">
    <img src="/images/training/car-hacking-village-cluster.jpeg"
         alt="A powered Škoda Fabia instrument cluster on a workshop bench beside a laptop running the WebUSB CAN console."
         loading="lazy">
  </div>
  <figcaption><em>Photos: DLH, BSides Luxembourg 2026.</em></figcaption>
</figure>

{{< toc >}}

## Hands-on Hacking Automotive Systems
Modern vehicles are computers on wheels. Dozens of ECUs talk over CAN, LIN, and increasingly automotive Ethernet. Yet most engineers, and most security teams, have never put a probe on one. This workshop closes that gap.

Participants leave able to read live CAN traffic, craft and replay frames, and reason about where the real attack surface lives in a connected vehicle.

### What you'll learn
- How modern vehicle networks work, and where the trust boundaries are (or aren't).
- Reading and decoding live CAN traffic from a controlled lab bench.
- Crafting, injecting, and replaying frames using open-source tooling like [WebUSB CAN](https://roaldnefs.github.io/webusb-can/).
- Walking through realistic attacks on the CAN bus, end to end.
- Where to go next: tools, references, and how to build your own bench.

### Who it's for
- Security engineers and researchers branching into vehicle systems.
- Platform and embedded engineers working with CAN-connected hardware.
- Students and professionals moving into automotive cybersecurity.

No prior automotive experience required. Comfort with a Linux terminal helps.

### Format options
Pick the format that fits your audience, time, and how deep you want to go.

| Duration | Style | What's included |
|:----------|:--------|:-------------|
| **1-hour talk** | Lecture + live demo | High-level introduction with live CAN demonstrations |
| **Half-day workshop** | Hands-on lab | Guided CAN sniffing, decoding, and injection on a lab bench |
| **Full-day technical training** | Deep dive | Reverse engineering, attack labs, and a take-home tooling setup |
| **[Car Hacking Village](https://roaldnefs.github.io/car-hacking-village/)** | Drop-in conference booth | Multi-day village with rotating demos and try-it-yourself stations |

All formats are delivered on a controlled lab setup. No production vehicles or shared infrastructure are touched.

## Hands-on Hardware Hacking
Consumer routers, embedded controllers, and IoT devices ship with debug interfaces left open and firmware that was never meant to be read. This workshop teaches you to find those interfaces, talk to them, and pull the firmware off the chip: nothing more exotic than a multimeter, a logic analyzer, and a CH341A programmer.

Participants leave able to identify and connect to UART debug ports, interact with a live serial console, and dump flash firmware for offline analysis.

### What you'll learn
- Identifying debug headers on a PCB and locating the UART TX, RX, and GND pins using a multimeter and logic analyzer.
- Measuring and matching voltage levels (3.3 V vs. 5 V) and using logic level converters to avoid damaging target hardware.
- Connecting a USB-to-UART adapter to get an interactive shell, including root shells on older TP-Link router firmware.
- Dumping SPI flash firmware with a CH341A programmer for offline analysis.
- Where to go next: reading firmware images, extracting filesystems, and what to look for inside.

### Who it's for
- Security engineers and researchers new to embedded and hardware targets.
- Developers working on embedded Linux or IoT products who want to understand the attacker's perspective.
- Students and professionals moving into hardware or product security.

No prior hardware experience required. Comfort with a Linux terminal helps.

### Format options
Pick the format that fits your audience, time, and how deep you want to go.

| Duration | Style | What's included |
|:----------|:--------|:-------------|
| **1-hour talk** | Lecture + live demo | Introduction to hardware attack surfaces with live UART and flash demonstrations |
| **Half-day workshop** | Hands-on lab | Guided UART identification, serial console access, and firmware dumping on real hardware |
| **Full-day technical training** | Deep dive | End-to-end: find the port, get the shell, dump and analyse the firmware |

All formats use owned, controlled devices. No production systems are touched.

## Past sessions
- **OrangeCon 2026**: Car Hacking Village.
- **BSides Luxembourg 2026**: automotive hacking workshop and Car Hacking Village. [View slides](/bsidesluxembourg.pdf).
- **BSides Groningen 2026**: Car Hacking Village.
- **BSides Kraków 2025**: automotive hacking talk.
- **PyGrunn 2025**: automotive hacking talk, Python edition.
- **J-Fall 2025**: automotive hacking talk, Java edition.
- **OrangeCon 2025**: automotive hacking workshop.
- **Cyberbootcamp 2025**: automotive hacking workshop for Challenge the Cyber.
- **CJIB 2025**: automotive hacking workshop.
- Hardware hacking sessions for the [Warpnet](https://warpnet.nl) team and at community meetups.

## Book a session
Hosting a meetup, internal training day, or a track at your conference? Reach out at [info@roaldnefs.com](mailto:info@roaldnefs.com) and include:

- Audience size and background.
- Preferred format (talk, half-day, or full day).
- Tentative date and location. On-site in NL/EU is easiest; remote works for the talk format.
