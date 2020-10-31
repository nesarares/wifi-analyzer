import { EthernetHeader, EtherType } from './ethernet';
import { IPv4Header } from './ip';

export class TcpPacket {
  ethernetHeader: EthernetHeader;
  ipHeader: IPv4Header;

  constructor(buf: Buffer) {
    if (buf.byteLength < EthernetHeader.ETHERNET_HEADER_LENGTH) {
      throw new Error('Buffer less than Ethernet Header length');
    }
    this.ethernetHeader = new EthernetHeader(buf);

    if (this.ethernetHeader.type !== EtherType.IPv4) {
      throw new Error(`Protocol not supported: ${EtherType[this.ethernetHeader.type]}`);
    }
    this.ipHeader = new IPv4Header(buf.slice(this.ethernetHeader.length));
  }
}
