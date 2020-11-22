import { MacAddress } from './address';

// https://www.oreilly.com/library/view/80211-wireless-networks/0596100523/ch04.html
export class MacHeader {
  static MAC_HEADER_LENGTH = 24; // bytes

  frameControl: number; // 2 bytes
  duration: number; // 2 bytes
  destinationMac: MacAddress; // 6 bytes
  sourceMac: MacAddress; // 6 bytes
  bssid: MacAddress; // 6 bytes
  seqCtl: number; // 2 bytes

  constructor(private buf: Buffer) {
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
  * Frame control   : ${this.frameControl.toString(2)}
  * Duration        : ${this.duration}
  * Destination MAC : ${this.destinationMac.toString()}
  * Source MAC      : ${this.sourceMac.toString()}
  * BSSID           : ${this.bssid.toString()}
  * Seq-ctl         : ${this.seqCtl}`;
  }

  toObject() {
    return {
      frameControl: this.frameControl,
      duration: this.duration,
      destinationMac: this.destinationMac.toString(),
      sourceMac: this.sourceMac.toString(),
      bssid: this.bssid.toString(),
      seqCtl: this.seqCtl,
    }
  }
}
