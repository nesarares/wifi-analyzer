const UTC_EPOCH = Date.UTC(1970, 0, 1);

export class Timeval {
  tv_sec: number; // 4 bytes
  tv_usec: number; // 4 bytes

  constructor(buf: Buffer) {
    this.tv_sec = buf.readUInt32LE(0);
    this.tv_usec = buf.readUInt32LE(4);
  }

  toString() {
		const d = new Date(UTC_EPOCH);
    d.setSeconds(this.tv_sec);
    d.setMilliseconds(this.tv_usec / 1000);
    return d.toLocaleString("en-GB");
  }
}

export class PacketHeader {
  ts: Timeval; // timestamp - 8 bytes
  caplen: number; // length of portion present - 4 bytes
  len: number; // length of this packet - 4 bytes

  constructor(buf: Buffer) {
    this.ts = new Timeval(buf.slice(0, 8));
    this.caplen = buf.readUInt32LE(8);
    this.len = buf.readUInt32LE(12);
  }
}
