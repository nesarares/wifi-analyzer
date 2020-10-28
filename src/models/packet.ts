import { EthernetHeader } from './ethernet';

export class Packet {
  ethernetHeader: EthernetHeader;

  constructor(buf: Buffer) {
    if (buf.byteLength < EthernetHeader.ETHERNET_HEADER_LENGTH) {
      throw new Error('Buffer less than Ethernet Header length');
    }

    this.ethernetHeader = new EthernetHeader(buf.slice(0, 14));
  }
}
