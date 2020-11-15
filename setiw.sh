#!/bin/bash
# Utility to set the wifi adapter to either managed or monitor mode.
#   * sudo setiw.sh monitor <device_name> - to set it in monitor mode
#   * sudo setiw.sh managed <device_name> - to set it in managed mode

MODE=$1
DEVICE=$2

if [ "$DEVICE" = "" ]; then
	DEVICE="wlp8s0"
fi

# sudo airmon-ng check kill

if [ "$MODE" = "monitor" ]; then
	service NetworkManager stop
fi

ifconfig $DEVICE down
iwconfig $DEVICE mode $MODE
ifconfig $DEVICE up
iwconfig

if [ "$MODE" = "managed" ]; then
	sudo service NetworkManager restart
fi
