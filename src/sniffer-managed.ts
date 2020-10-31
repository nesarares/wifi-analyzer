import { createSession, PacketWithHeader } from 'pcap';
import { Packet } from './models/packet';
import { PacketHeader } from './models/packet-header';
import { logger } from './utils/logger';

const device = process.argv[2] || 'wlp8s0';
const filter = 'port 80';

const main = () => {
  const pcap_session = createSession(device, {
    promiscuous: true,
    filter,
  });
  const linkType = pcap_session.link_type;

  logger.log(`Listening on ${(pcap_session as any).device_name}`);
  logger.log(`Link type: ${linkType}`);
  logger.log('');

  pcap_session.on('packet', function (rawPacket: PacketWithHeader) {
    const header = new PacketHeader(rawPacket.header);
    const packet = new Packet(rawPacket.buf);
    const linkType = rawPacket.link_type;

    logger.log(`----------- [${header.ts.toString()}] - ${linkType} -----------`);
    packet.ethernetHeader.print();
    logger.log('');
  });
};

main();
