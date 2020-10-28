import { createSession, PacketWithHeader } from 'pcap';
import { PacketHeader } from './models/packet-header';

const device = process.argv[2] || 'wlp8s0mon';
const filter = 'type mgt subtype beacon';

const pcap_session = createSession(device, {
  monitor: true,
  promiscuous: false,
  filter
});
const linkType = pcap_session.link_type;

console.log(`Listening on ${(pcap_session as any).device_name}`);
console.log(`Link type: ${linkType}`);
console.log('');

pcap_session.on('packet', function (rawPacket: PacketWithHeader) {
  const header = new PacketHeader(rawPacket.header);
  const linkType = rawPacket.link_type;
  
  console.log(`----------- [${header.ts.toString()}] - ${linkType} -----------`);
  console.log(rawPacket);
  // console.log('');
});
