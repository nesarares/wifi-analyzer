import { logger } from '../utils/logger';

export class MacAddress {
  components: number[] = [];

  constructor(buf: Buffer) {
    for (let i = 0; i < 6; i++) {
      this.components.push(buf.readUInt8(i));
    }
  }

  toString() {
    return this.components.map((n) => n.toString(16)).join(':');
  }
}

export class EthernetHeader {
  static ETHERNET_HEADER_LENGTH = 14;

  destinationMac: MacAddress;
  sourceMac: MacAddress;
  type: number;

  constructor(buf: Buffer) {
    this.destinationMac = new MacAddress(buf.slice(0, 6));
    this.sourceMac = new MacAddress(buf.slice(6, 12));
    this.type = buf.readUInt16LE(12);
  }

  print() {
    logger.log('Ethernet Header:');
    logger.log(`  * Destination MAC : ${this.destinationMac.toString()}`);
    logger.log(`  * Source MAC      : ${this.sourceMac.toString()}`);
  }
}
