import { createSession, PacketWithHeader } from 'pcap';
import { TcpPacket } from './models/tcp-packet';
import { PacketHeader } from './models/packet-header';
import { logger } from './utils/logger';
import { constants } from './utils/constants';

const main = () => {
  const pcap_session = createSession(constants.DEVICE, {
    promiscuous: true,
    filter: constants.SNIFFER_FILTER,
  });
  const linkType = pcap_session.link_type;

  logger.log(`Listening on ${(pcap_session as any).device_name}`);
  logger.log(`Link type: ${linkType}`);
  logger.log('');

  pcap_session.on('packet', function (rawPacket: PacketWithHeader) {
    const header = new PacketHeader(rawPacket.header);
    logger.log(`----------- [${header.ts.toString()}] -----------`);

    try {
      const packet = new TcpPacket(rawPacket.buf.slice(0, header.caplen));
      logger.log(packet.ethernetHeader.toString());
      logger.log(packet.ipHeader.toString());
      logger.log(packet.tcpHeader.toString());
      if ([80].includes(packet.tcpHeader.destinationPort) && packet.payload) {
        logger.log(packet.payload.toString());
      }
    } catch (error) {
      logger.log(error.message);
    }

    logger.log('');
  });
};

main();
