import { createSession, PacketWithHeader } from 'pcap';
import { BeaconPacket, BeaconPacketObject } from './models/beacon-packet';
import { PacketHeader } from './models/packet-header';
import { logger } from './utils/logger';
import { constants } from './utils/constants';
import { exec } from 'child_process';

const filter = 'type mgt subtype beacon';

export class WifiAnalyzer {
  currentChannel = 1;
  listeners: ((packet: BeaconPacketObject) => void)[] = [];

  constructor(private device: string) {}

  changeWifiChannel(channel = (this.currentChannel + 1) % 14) {
    if (channel === 0) channel++;
    exec(`iwconfig ${this.device} channel ${channel}`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`!!! Could not change channel to ${channel}`);
      } else {
        console.log(`Changed channel to ${channel}`);
        this.currentChannel = channel;
      }
    });
  }

  onPacket(callback: (packet: BeaconPacketObject) => void) {
    this.listeners.push(callback);
  }

  run() {
    const pcap_session = createSession(this.device, {
      monitor: true,
      promiscuous: false,
      filter,
    });
    const linkType = pcap_session.link_type;

    logger.log(`Listening on ${(pcap_session as any).device_name}`);
    logger.log(`Link type: ${linkType}`);
    logger.log('');

    this.changeWifiChannel(1);
    setInterval(() => this.changeWifiChannel(), constants.CHANGE_WIFI_CHANNEL_INTERVAL);

    pcap_session.on('packet', (rawPacket: PacketWithHeader) => {
      const header = new PacketHeader(rawPacket.header);
      logger.log(`----------- [${header.ts.toString()}] -----------`);
      if (header.caplen !== header.len) {
        logger.log('!!!! CAPTURED LENGTH !== LENGTH. SKIPPING.');
        return;
      }

      try {
        const packet = new BeaconPacket(rawPacket.buf.slice(0, header.caplen));
        logger.log(packet.radiotapHeader.toString());
        logger.log(packet.macHeader.toString());
        logger.log(packet.body.toString());
        logger.log('');

        this.listeners.forEach((callback) => callback(packet.toObject()));
      } catch (error) {
        console.error(error);
        // logger.log(error.message);
      }
    });
  }
}
