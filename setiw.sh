#!/bin/bash
# Utility to set the wifi adapter to either managed or monitor mode.
# To use with the airmon-ng script, run:
#   * sudo setiw.sh start <device_name> - to set it in monitor mode
#   * sudo setiw.sh start <device_name> - to set it in managed mode

MODE=$1
DEVICE=$2

if [ "$DEVICE" = "" ]; then
	DEVICE="wlp8s0"
fi

if [ "$MODE" = "stop" ]; then
	DEVICE="${DEVICE}mon"
fi

# turn monitor mode using airmon-ng

sudo airmon-ng check kill
sudo airmon-ng $MODE $DEVICE

if [ "$MODE" = "stop" ]; then
	service NetworkManager restart
fi

# turn monitor mode using iwconfig

# ifconfig $DEVICE down
# iwconfig $DEVICE mode $MODE
# ifconfig $DEVICE up
# iwconfig
