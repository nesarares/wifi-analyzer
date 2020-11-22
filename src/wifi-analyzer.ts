import { createSession, PacketWithHeader } from 'pcap';
import { BeaconPacket } from './models/beacon-packet';
import { PacketHeader } from './models/packet-header';
import { logger } from './utils/logger';
import { constants } from './utils/constants';
import { exec } from 'child_process';

const device = process.argv[2] || 'wlp8s0mon';
const filter = 'type mgt subtype beacon';

let currentChannel = 1;

const changeWifiChannel = (channel = (currentChannel + 1) % 14) => {
  if (channel === 0) channel++;
  exec(`iwconfig ${device} channel ${channel}`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(`!!! Could not change channel to ${channel}`);
    } else {
      console.log(`Changed channel to ${channel}`);
      currentChannel = channel;
    }
  });
};

const main = () => {
  const pcap_session = createSession(device, {
    monitor: true,
    promiscuous: false,
    filter,
  });
  const linkType = pcap_session.link_type;

  logger.log(`Listening on ${(pcap_session as any).device_name}`);
  logger.log(`Link type: ${linkType}`);
  logger.log('');

  changeWifiChannel(1);
  setInterval(changeWifiChannel, constants.CHANGE_WIFI_CHANNEL_INTERVAL);

  pcap_session.on('packet', function (rawPacket: PacketWithHeader) {
    const header = new PacketHeader(rawPacket.header);
    logger.log(`----------- [${header.ts.toString()}] -----------`);
    if (header.caplen !== header.len) {
      logger.log("!!!! CAPTURED LENGTH !== LENGTH. SKIPPING.");
      return;
    }

    try {
      const packet = new BeaconPacket(rawPacket.buf.slice(0, header.caplen));
      logger.log(packet.radiotapHeader.toString());
      logger.log(packet.macHeader.toString());
      logger.log(packet.body.toString());
      logger.log('');
    } catch (error) {
      console.error(error);
      // logger.log(error.message);
    }
  });
};

main();
