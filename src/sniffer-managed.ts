import { createSession, PacketWithHeader } from 'pcap';
import { TcpPacket } from './models/tcp-packet';
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
    logger.log(`----------- [${header.ts.toString()}] -----------`);

    try {
      const packet = new TcpPacket(rawPacket.buf);
      console.log(rawPacket.buf);
      logger.log(packet.ethernetHeader.toString());
      logger.log(packet.ipHeader.toString());
    } catch (error) {
      logger.log(error.message);
    }

    logger.log('');
  });
};

main();
