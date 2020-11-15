// https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_segment_structure
export class TcpHeader {
  sourcePort: number; // Source Port - 2 bytes
  destinationPort: number; // Destination Port - 2 bytes
  sequenceNumber: number; // Sequence Number - 4 bytes
  ackNumber: number; // Acknowledgement Number - 4 bytes
  dataOffset: number; // TCP Header Length (in words) - 4 bits
  flags: number; // Flags - 9 bits
  flagNS: boolean; // ECN-nonce flag
  flagCWR: boolean; // Congestion window reduced flag
  flagECE: boolean; // ECN-Echo flag
  flagURG: boolean; // Urgent pointer flag
  flagACK: boolean; // Acknowledgment flag
  flagPSH: boolean; // Push function flag
  flagRST: boolean; // Reset connection flag
  flagSYN: boolean; // Synchronize sequence numbers flag
  flagFIN: boolean; // Last packet flag
  windowSize: number; // Window size - 2 bytes
  checksum: number; // Checksum - 2 bytes
  urgentPointer: number; // Urgent Pointer - 2 bytes
  options?: Buffer; // Optional options if dataOffset > 5

  constructor(public buf: Buffer) {
    this.sourcePort = buf.readUInt16BE(0);
    this.destinationPort = buf.readUInt16BE(2);
    this.sequenceNumber = buf.readUInt32BE(4);
    this.ackNumber = buf.readUInt32BE(8);

    const dataOffsetNS = buf.readUInt8(12);
    this.dataOffset = (dataOffsetNS & 0xf0) >>> 4;
    this.flagNS = (dataOffsetNS & 0x01) > 0;

    if (buf.byteLength < this.dataOffset * 4) {
      throw new Error('Incomplete TCP Header');
    }

    const restOfFlags = buf.readUInt8(13);
    this.flags = restOfFlags + ((this.flagNS ? 1 : 0) << 8);
    this.flagCWR = (this.flags & 0x80) > 0;
    this.flagECE = (this.flags & 0x40) > 0;
    this.flagURG = (this.flags & 0x20) > 0;
    this.flagACK = (this.flags & 0x10) > 0;
    this.flagPSH = (this.flags & 0x08) > 0;
    this.flagRST = (this.flags & 0x04) > 0;
    this.flagSYN = (this.flags & 0x02) > 0;
    this.flagFIN = (this.flags & 0x01) > 0;

    this.windowSize = buf.readUInt16BE(14);
    this.checksum = buf.readUInt16BE(16);
    this.urgentPointer = buf.readUInt16BE(18);

    if (this.dataOffset > 5) {
      this.options = buf.slice(20, this.dataOffset * 4);
    }
  }

  get length(): number {
    return this.dataOffset * 4; // bytes
  }

  toString() {
    return `TCP Header ==========================
  * Source port      : ${this.sourcePort}
  * Destination port : ${this.destinationPort}
  * Sequence number  : ${this.sequenceNumber}
  * ACK number       : ${this.ackNumber}
  * Data offset      : ${this.dataOffset}
  * Flags            : ${this.flags}
    * NS             : ${this.flagNS}
		* CWR            : ${this.flagCWR}
		* ECE            : ${this.flagECE}
		* URG            : ${this.flagURG}
		* ACK            : ${this.flagACK}
		* PSH            : ${this.flagPSH}
		* RST            : ${this.flagRST}
		* SYN            : ${this.flagSYN}
		* FIN            : ${this.flagFIN}
  * Window size      : ${this.windowSize}
  * Checksum         : ${this.checksum}
  * Urgent pointer   : ${this.urgentPointer}`;
  }
}
