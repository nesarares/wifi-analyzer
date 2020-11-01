import { MacAddress } from './address';

export enum EtherType {
  IPv4 = 0x0800,
  IPv6 = 0x86dd,
  ARP = 0x0806,
  RARP = 0x8035,
  LOOPBACK = 0x9000,
}

export class EthernetHeader {
  static ETHERNET_HEADER_LENGTH = 14; // bytes

  destinationMac: MacAddress; // 6 bytes
  sourceMac: MacAddress; // 6 bytes
  type: EtherType; // 2 bytes

  constructor(public buf: Buffer) {
    this.destinationMac = new MacAddress(buf.slice(0, 6));
    this.sourceMac = new MacAddress(buf.slice(6, 12));
    this.type = buf.readUInt16BE(12);
  }

  get length(): number {
    return EthernetHeader.ETHERNET_HEADER_LENGTH;
  }

  toString() {
    return `Ethernet Header ==========================
  * Destination MAC : ${this.destinationMac.toString()}
  * Source MAC      : ${this.sourceMac.toString()}
  * Type            : ${EtherType[this.type]}`;
  }
}
