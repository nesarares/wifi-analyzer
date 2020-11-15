import { MacAddress } from './address';

export class MacHeader {
  static MAC_HEADER_LENGTH = 24; // bytes

  frameControl: number; // 2 bytes
  duration: number; // 2 bytes
  destinationMac: MacAddress; // 6 bytes
  sourceMac: MacAddress; // 6 bytes
  bssid: MacAddress; // 6 bytes
  seqCtl: number; // 2 bytes

  constructor(public buf: Buffer) {
    this.frameControl = buf.readUInt16BE(0);
    this.duration = buf.readUInt16BE(2);
    this.destinationMac = new MacAddress(buf.slice(4, 10));
    this.sourceMac = new MacAddress(buf.slice(10, 16));
    this.bssid = new MacAddress(buf.slice(16, 22));
    this.seqCtl = buf.readUInt16BE(22);
  }

  get length(): number {
    return MacHeader.MAC_HEADER_LENGTH;
  }

  toString() {
    return `MAC Header ==========================
  * Frame control   : ${this.frameControl}
  * Duration        : ${this.duration}
  * Destination MAC : ${this.destinationMac.toString()}
  * Source MAC      : ${this.sourceMac.toString()}
  * BSSID           : ${this.bssid.toString()}
  * Seq-ctl         : ${this.seqCtl}`;
  }
}
