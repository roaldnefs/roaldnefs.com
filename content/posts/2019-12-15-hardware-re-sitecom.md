---
title: Hardware Reversing the Sitecom Wireless Router 150N X1
slug: Hardware Reverse a Wireless Router
date: 2019-12-15T00:00:00+02:00
type: post
draft: false
---

Last week I've bought a Rigol DS1102E digital oscilloscope and was very eager to test it out. When going to my bin of old hardware I've found a Sitecom Wireless Router 150N X1. After opening up the router I immediately spotted the UART debugging interface (_top left in the picture_). In this post we will go through the process of connecting to an unknown serial interface.

![Inside of the Sitecom Wireless Router 150N X1](/images/posts/2019/12/15/sitecom_01.jpg)

The UART debugging interface wasn't labeled, so I had to figure out what each port was doing. The two pins on the right are directly connected to the IC, so I figured that those to are the **RX** and **TX** ports. By connecting a multi meter to the two left most pins I've found that the serial port is using **3.3V** and the left most connector is the **VCC** followed by the **GND** pin. By connecting the ground lead of the multi meter to **GND** pin on the serial interface I quickly spotted **RX** port (_positive voltage_). From left to right the pins are: **VCC**, **GND**, **TX** and **RX**.

![Determining the pins on the serial interface using a multimeter](/images/posts/2019/12/15/sitecom_02.jpg)

We now know the operating voltage and pin layout of the serial interface but the baud rate is still unknown, so I've connected my new oscilloscope to the **GND** and **TX** pins on the serial interface and set it to trigger on a pulse. After power cycling the router is saw the following signal:

![Inspecting the serial connection using a oscilloscope](/images/posts/2019/12/15/sitecom_03.jpg)

By determining the length of the shortest pulse I was able to figure out the baud rate using the following formula: `1 / time * 106`, in my case: `1 / (886µs / 870µs) * 106 = 62500`. But this isn't a usual baud rate, so I took once that was closest to 62500: **57600**.

![Inspecting length of the shortest pulse using a oscilloscope](/images/posts/2019/12/15/sitecom_04.jpg)

The USB to TTL module (_PL2303_) I had laying around operated on **5V**, because I was not willing to risk breaking the router I had to down convert to voltage to **3.3V**. This can be done using a [bi-directional logic level converter](https://www.sparkfun.com/products/12009).

![Connecting the serial interface to the laptop using a logic level converter](/images/posts/2019/12/15/sitecom_05.jpg)

Using the USB to serial connection we are able to connect to the router using minicom with the following command: `minicom -b 57600 -8 -D /dev/ttyUSB0`. After power cycling the router, the following output appears:

![Serial console on the Sitecom Wireless Router 150N X1](/images/posts/2019/12/15/sitecom_06.png)

According the the boot log the Sitecom Wireless Router 150N X1 is using Linux!