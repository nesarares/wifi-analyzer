# WiFi Analyzer & Sniffer

University project - Dynamic Networks and Specialized Operating System

## Requirements

* linux installation (tested on Ubuntu 20.04)
* nodejs (tested on 12.19.0)
* libpcap - `sudo apt-get install libpcap-dev`
* (optional) airmon-ng for monitor mode - `sudo apt-get install aircrack-ng`

## Running the project

* `npm install`
* find device name using iwconfig / ifconfig (e.g. wlp8s0)

### Sniffer (managed mode)

* if device is in monitor mode, set it back to managed mode `sudo setiw.sh stop <device_name>` and connect to a wifi network
* `sudo npm run sniffer:managed`
* open any http website

### WiFi Analyzer (desktop app)

* set device to monitor mode `sudo setam.sh start <device_name>`
* `sudo npm run analyzer:ui`

![Wi-Fi Analyzer](https://i.imgur.com/LdTheaW.png)

### WiFi Analyzer (terminal mode)

* set device to monitor mode `sudo setam.sh start <device_name>`
* `sudo npm run analyzer`