---
title: Spoofing Microchips used for Animal Identification
date: 2022-11-30T15:19:00+02:00
type: post
draft: false
featured: true
---
A microchip implanted under the skin of an animal is can be used for identification purposes. The microchips are using Radio Frequency Identification (RFID) technology to transmit an unique tag number using an electromagnetic field when in close contact with an nearby RFID reader device. The microchips are often used to help return lost pets quickly. The unique chip numbers are registered in a designated portal to let animal shelters, animal control officers and veterinarians to look up contact information of the animal's owner. During animal trials and events the microchips are often used to verify the animals identity.

This post will demonstrate how an attacker can create an “authentic” microchip by writing properly formatted data on blank or rewritable transponder, also known as spoofing. Unfortunately, the RFID reader devices do not differentiate between the authentic and spoofed microchips. The main intention behind this post is to encourage more secure ways of identifying animals instead of solely trusting the implanted microchip.

## Introduction to FDX-B
FDX-B is a protocol used as a common format for transponders. The protocol is fully described in ISO 11784 and ISO 11785. The transponders operate in the 134.2kHz band and use a biphase encoding scheme to transmit the data.

![Example of a biphase encoded signal](/images/posts/2022/11/30/microchip-3.png)

The power used for transmitting data is drawn from the electromagnetic field transmitted by the RFID reader when in close contact with the transponder. The transponders can carry up to 128 bits of data. The table below shows the example of the decoded FDX-B data in bits for the tag number 528140000795552.

![Decoded FDX-B data in bits for tag number 528140000795552](/images/posts/2022/11/30/microchip-1.png)

The data is structured according to the FDX-B protocol and will be transmitted with the least significant bit first (lsb). The 11 bit header is used to indicate the beginning of the data block. A logic 1 bit is sent after every 8 bits to differentiate the data from the header. The header is followed by the 38 bit national code, which corresponds to a 12 digit decimal code to uniquely identify an animal. This is followed by the 10 bit, 3 decimal digits, country code (e.g. 528 for the Netherlands). The next application identicator bit indicates whether the 24 extra application data bits are used at the end of the block. The 14 bits followed after the application identicator bit are reserved for future use. The next bit is the animal application identicator. When the transponder is used for animal identification purposes this bit is set to 1. To be able to verify the data block, a 16 bit checksum is calculated according to the ISO 11784 & 11785 standards.

## Buying (re)writable FDX-B microchips and programmers
Although some countries regulate who can buy, implant and register microchips it’s still possible to buy micropships as an individual. In the Netherlands for example, only registered microchippers and veterinarians are allowed to microchip dogs and register the microchip numbers at a designated portal[^1]. However it’s still possible for non-registered microchippers to find and buy (re)writable ICAR certificated FDX-B microchips online as shown by the advert in the figure below.

![Online advert of rewritable FDX-B transponders](/images/posts/2022/11/30/microchip-4.png)

The rewritable microchips often come with a preprogrammed tag number that still needs to be overwritten in order to spoof an authentic number, this can be done using a so called programmer. The RFID programmers often come included with the required software to write properly formatted data to the transponders. The figures below show two programmers which can be used to write valid FDX-B microchips. The Proxmark 3 device even allows the user to simulate a microchip.

![Online adverts of programmers which can be used for FDX-B transponders](/images/posts/2022/11/30/microchip-5.png)

As shown by the example adverts in the figures above the total cost of spoofing a microchip including the required programmer and shipping is just around €50. The attacker will only need a single programmer to spoof additional microchips, lowering the cost per spoofed microchip even more.

##  Spoofing a FDX-B microchip
The examples below will show how a custom chip number can be written to a (re)writable transponder and allow it to be scanned as an authentic microchip using a RFID reader. This example uses a Proxmark 3 programmer to write the properly formatted data on the transponder. For example, the command for writing tag number 528140000795552 to the transponder:

```
pm3 > lf fdxb clone --em --country 528 --national 140000795552 --animal
```

After writing the data to the rewritable transponder it can also be read by the Proxmark 3 to verify whether the write command was successful. The example command below shows the formatted data after writing the tag number to the transponder:

```
pm3 > lf fdxb reader
[+] FDX-B / ISO 11784/5 Animal
[+] Animal ID          528-140000795552
[+] National Code      140000795552 (0x2098B29BA0)
[+] Country Code       528 - Kingdom of the Netherlands
[+] Reserved/RFU       0 (0x0000)
[+]   Animal bit set?  True
[+]       Data block?  False  [value 0x0]
[+]         RUDI bit?  False
[+]        User Info?  0 (RFU)
[+]   Replacement No?  0 (RFU)
[+] CRC-16             0xF283 (ok)
[+] Raw                05 D9 4D 19 04 21 00 01
```

When scanning the spoofed microchip using a common RFID reader device it shows as an authentic microchip. By writing the extended/application data using the `--extended` flag some readers will even be showing the spoofed microchip temperature.

![Spoofed microchip being scanned by a RFID reader device](/images/posts/2022/11/30/microchip-2.jpeg)

The above figure shows the spoofed microchip with tag number 528140000795552 being scanned by a RFID reader device. The reader acts as if it is an authentic microchip, to make the user believe that this must actually be the dog with this particular chip number.

## Conclusion
Although microchips might help return lost pets more quickly, they should not be solely trusted on to verify the animals identity. An attacker can create an “authentic” microchip by writing properly formatted data on blank or rewritable transponder, also known as spoofing. Unfortunately, the RFID reader devices do not differentiate between the authentic and spoofed microchips.

[^1]: https://business.gov.nl/regulation/registering-dogs-and-pet-passports/