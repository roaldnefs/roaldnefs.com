---
title: How to extract an AppImage and add it to the Ubuntu Sidebar
date: 2024-12-25T00:00:00+02:00
type: post
authors:
  - Roald Nefs
tags:
  - featured
draft: false
featured: true
---

In this post, we'll guide you through extracting an AppImage and integrating it into the Ubuntu sidebar for easy access. As an example, we'll use **SavvyCAN**, a CANBus reverse engineering tool.
<!--more-->

### Download the AppImage

Start by downloading the AppImage file for the application you want to install. For this guide, we'll use the `SavvyCAN-x86_64.AppImage`. Once the download is complete, you'll need to make the AppImage executable to run it. Use the following command:

```bash
chmod +x SavvyCAN-x86_64.AppImage
```

### Resolve missing dependencies (if needed)

When you attempt to run the AppImage, you might encounter an error if a required library, such as `libfuse.so.2`, is missing. For example:

```bash
$ ./SavvyCAN-x86_64.AppImage

dlopen(): error loading libfuse.so.2

AppImages require FUSE to run. 
You might still be able to extract the contents of this AppImage if you run it
with the --appimage-extract option.
```

To resolve this, install the missing libfuse library using the following command (tested on Ubuntu 24.04):

```bash
sudo apt install libfuse2t64
```

After installing the library, you should be able to execute the AppImage by double-clicking it or running it from the terminal.

### Extract the AppImage

For faster startup times and easier integration into the desktop environment, you can extract the AppImage. This also allows you to set it up as a regular desktop application with a sidebar shortcut.

To extract the AppImage, run the following command:

```bash
$ ./SavvyCAN-x86_64.AppImage --appimage-extract
```

This creates a directory named `squashfs-root`, which contains all the extracted files, including the `AppRun` file and (hopefully) the application's icon.

### Move the extracted files to a permanent location

Move the `squashfs-root` directory to a permanent location, such as `/opt`, and rename it for easier access:

```bash
sudo mv squashfs-root /opt/savvycan
```

### Create a Desktop Entry

Many extracted AppImages include a `*.desktop` file, but you'll need to verify and customize it. For **SavvyCAN**, here's an example of a complete desktop entry file:

```ini
[Desktop Entry]
Type=Application
Name=SavvyCAN
GenericName=CANBus reverse engineering tool
Comment=Facilitates reverse engineering of canbus captures
Exec=/opt/savvycan/AppRun %F
Icon=/opt/savvycan/SavvyCAN.png
Terminal=false
Categories=Development;Electronics;IDE;
MimeType=text/x-application;
Keywords=embedded electronics;electronics;canbus;reverse engineering;
X-Desktop-File-Install-Version=0.27
```

Save this content as `savvycan.desktop`.

### Install the Desktop Entry

Install the desktop entry file using the `desktop-file-install` command. This validates and moves the file to `/usr/share/applications`:

```bash
sudo desktop-file-install savvycan.desktop
```

After completing these steps, SavvyCAN should appear in your application list. You can also pin it to the Ubuntu sidebar for quick access.
