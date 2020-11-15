import { createSession, PacketWithHeader } from 'pcap';
import { BeaconPacket } from './models/beacon-packet';
import { PacketHeader } from './models/packet-header';
import { logger } from './utils/logger';

const device = process.argv[2] || 'wlp8s0mon';
const filter = 'type mgt subtype beacon';

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

  pcap_session.on('packet', function (rawPacket: PacketWithHeader) {
    const header = new PacketHeader(rawPacket.header);
    logger.log(`----------- [${header.ts.toString()}] -----------`);
    
    try {
      const packet = new BeaconPacket(rawPacket.buf.slice(0, header.caplen));
      // console.log(rawPacket.buf.slice(0, header.caplen).toString('hex'));
      // console.log(rawPacket.buf.slice(0, header.caplen).toString('ascii'));
      logger.log(packet.radiotapHeader.toString());
      logger.log(packet.macHeader.toString());
      logger.log(packet.body.toString());
      logger.log('');
    } catch (error) {
      console.error(error);
      logger.log(error.message);
    }
  });
};

main();
