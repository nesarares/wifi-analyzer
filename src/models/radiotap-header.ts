export class RadiotapHeader {
  version: number; // 1 byte
  pad: number; // 1 byte
  len: number; // 2 bytes
  present: number; // 2 bytes

  constructor(public buf: Buffer) {
    this.version = buf.readUInt8(0);
    this.pad = buf.readUInt8(1);
    this.len = buf.readUInt16LE(2);
    this.present = buf.readUInt16LE(4);
  }

  get length(): number {
    return this.len;
  }

  toString() {
    return `Radiotap Header ==========================
  * Version : ${this.version}
  * Pad     : ${this.pad};
  * Length  : ${this.len};
  * Present : ${this.present.toString(2)}`;
  }
}
