# WiFi Analyzer & Sniffer

University project - Dynamic Networks and Specialized Operating Systems

### This repository is a work in progress.

## Requirements

* linux installation (tested on Ubuntu 20.04)
* nodejs (tested on 12.19.0)
* libpcap - `sudo apt-get install libpcap-dev`
* (optional) airmon-ng for monitor mode - `sudo apt-get install aircrack-ng`

## Running the project

* `npm install`
* find device name using iwconfig / ifconfig (e.g. wlp8s0)

### WiFi Analyzer

* set device to monitor mode `sudo setiw.sh start <device_name>`
* `sudo npm run analyzer`

### Sniffer (managed mode)

* if device is in monitor mode, set it back to managed mode `sudo setiw.sh stop <device_name>` and connect to a wifi network
* `sudo npm run sniffer:managed`
* open any http website