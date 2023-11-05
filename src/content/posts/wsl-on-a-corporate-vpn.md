---
title: 'WSL on a corporate VPN'
pubDate: 2022-07-01
description: 'For when you are given a Windows machine, fear not!'
author: 'Alex Leye'
image:
    url: '/wsl-welcome.png'
    alt: 'WSL welcome image.'
tags: ["linux", "blogging"]
---
## WSL on a Corporate VPN
Working in a corporate environment, you may often find yourself given a Lenovo Thinkpad and told to get to work.
The problem is, this machine runs Windows and that means you can't run anything without a world of pain. 

The good news is, even Microsoft knew this. Rather than re-inventing the open-source wheel for their OS, they instead
brought linux into their ecosystem in a round-about way. Windows Subsystem for Linux (WSL) and in particular WSL2 provide
a linux emulation inside your Windows environment by utilising hardware-enabled Hyper-V.