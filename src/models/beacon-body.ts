export class BeaconBody {
  timestamp: bigint; // 8 bytes
  beaconInterval: number; // 2 bytes
  capabilityInfo: number; // 2 bytes
  ssid: string; // variable

  constructor(public buf: Buffer) {
    this.timestamp = buf.readBigUInt64LE(0);
    this.beaconInterval = buf.readUInt16LE(8);
    this.capabilityInfo = buf.readUInt16LE(10);
    const ssidElementId = buf.readUInt8(12);
    const ssidLength = buf.readUInt8(13);
    this.ssid = buf.slice(14, 14 + ssidLength).toString('ascii');
  }

  get length(): number {
    return 0;
  }

  toString() {
    return `Beacon body ==========================
  * Timestamp       : ${this.timestamp} us 
  * Beacon Interval : ${this.beaconInterval}
  * SSID            : ${this.ssid}
  * `;
  }
}
