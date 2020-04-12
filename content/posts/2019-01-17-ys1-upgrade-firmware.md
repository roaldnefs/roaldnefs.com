---
title: Update YARD Stick One Firmware
date: 2019-01-17T00:00:00+02:00
type: post
draft: false
---

Today I received my [YARD Stick One](https://greatscottgadgets.com/yardstickone/) (Yet Another Radio Dongle) created by Great Scott Gadgets. The dongle  can transmit and receive digital wireless signals at frequencies below  1GHz. The YARD Stick One is not a SDR, because the I/Q  samples are directly demodulated by the chipset instead of send to the  host over USB. The YARD Stick One therefore isn’t compatible with any  SDR software, but you can use something called [rfcat](https://github.com/atlas0fd00m/rfcat.git).

Rfcat allows the user to drive the YARD Stick One using Python and abstracts a lot if complexity. The YARD Stick One has rfcat  pre-installed, with a USB bootloader to update the firmware. I’ve  received the YARD Stick One with outdated firmware, so I wanted to  update it before using it any further.

**Note:** I’m using Ubuntu 18.04 to update the firmware of my YARD Stick One!

Start by cloning the rfcat repository:

```console
$ git clone https://github.com/atlas0fd00m/rfcat.git
$ cd rfcat
```

In order to allow non-root access to the YARD Stick One you will need to update your udev rules using the following commands:

```console
$ sudo cp etc/udev/rules.d/20-rfcat.rules /etc/udev/rules.d
$ sudo udevadm control --reload-rules
```

From within the rfcat directory you can install the software by running the install script:

```console
$ sudo python setup.py install
```

Once I started the interactive Python shell for rfcat I was greeted by the following error message:

```console
$ rfcat -r
Traceback (most recent call last):
  File "/usr/local/bin/rfcat", line 8, in <module>
    from rflib import *
  File "/usr/local/lib/python2.7/dist-packages/rflib/__init__.py", line 2, in <module>
    from chipcon_nic import *
  File "/usr/local/lib/python2.7/dist-packages/rflib/chipcon_nic.py", line 4, in <module>
    import usb
ImportError: No module named usb
```

Install the missing dependencies. Make sure you install the correct version of `sdcc` because the newer version of `sdcc` seems to break according to [#39](https://github.com/atlas0fd00m/rfcat/issues/39#issuecomment-500005124) and [#42](https://github.com/atlas0fd00m/rfcat/issues/42#issuecomment-499832234).

```console
$ sudo apt install python-usb libusb-1.0.0 sdcc
```

I was now able to start the Python interactive shell for rfcat and  printed the YARD Stick One radio configuration by running the print `d.reprRadioConfig()` command.

```console
$ rfcat -r
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
Error in resetup():Exception('No Dongle Found.  Please insert a RFCAT dongle.',)
No module named IPython.frontend.terminal.interactiveshell
'RfCat, the greatest thing since Frequency Hopping!'

Research Mode: enjoy the raw power of rflib

currently your environment has an object called "d" for dongle.  this is how
you interact with the rfcat dongle:
    >>> d.ping()
    >>> d.setFreq(433000000)
    >>> d.setMdmModulation(MOD_ASK_OOK)
    >>> d.makePktFLEN(250)
    >>> d.RFxmit("HALLO")
    >>> d.RFrecv()
    >>> print d.reprRadioConfig()


>>> print d.reprRadioConfig()

== Hardware ==
Dongle:              YARDSTICKONE
Firmware rev:        0348
Compiler:            Not found! Update needed!
Bootloader:          CC-Bootloader

== Software ==
rflib rev:           65535

...
```

Take note of the following message in de radio configuration:

> Firmware rev: 0348 Compiler: Not found! Update needed!

The firmware seems to be outdated and my YARD Stick One came without  compiler installed. I wanted to update my dongle before using in any  further. In order to set in in bootloader mode I used the `d.bootloader()` command and the LEDs on the YARD Stick One started flashing.

```console
$ rfcat -r
>>> d.bootloader()
```

In another terminal window I changed the directory to `rfcat/firware` and made sure the `rfcat_bootloader` command was in my path. This command is used to install the new firmware on the dongle.

```console
$ cd rfcat/firmware
$ which rfcat_bootloader
/usr/local/bin/rfcat_bootloader
```

I issued the `make installRfCatYS1CCBootloader` command to update the firmware.

```console
$ make installRfCatYS1CCBootloader
```

After checking the radio configuration of my YARD Stick One, the firmware seems to be updated.

```console
$ rfcat -r
>>> print(d.reprRadioConfig())
== Hardware ==
Dongle:              YARDSTICKONE
Firmware rev:        5535
Compiler:            SDCCv350
Bootloader:          CC-Bootloader

== Software ==
rflib rev:           65535

...
```

RfCat, the greatest thing since Frequency Hopping!

## Enable bootloader mode when the firmware isn’t running

The bootloader mode on the YARD Stick One can be triggered by connecting pins 7 and 9 on the P1 expansion header.

```
-----------------------------------------
| YARD Stick One      2 4 6 8 10 12 14  |
|                     1 3 5 7 9  11 13  ------
|                                        USB |
|                                       ------
|                                       |
-----------------------------------------
```

**EDIT:** I’m currently running Ubuntu 19.04 and thus installed sdcc version 3.9.0, which results in the same errors as [#42](https://github.com/atlas0fd00m/rfcat/issues/42). Version 3.5.0 of sdcc seems to work fine. I was able to ground pin 7 and pin 9 on the YS1 using a paperclip.

![Enable bootloader mode on the YARD Stick One using a paperclip](/images/posts/2019/01/17/ys1_bootloader.jpg)
