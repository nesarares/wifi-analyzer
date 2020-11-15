export class MacAddress {
  components: number[] = [];

  constructor(buf: Buffer) {
    for (let i = 0; i < 6; i++) {
      this.components.push(buf.readUInt8(i));
    }
  }

  toString() {
    return this.components.map((n) => (n.toString(16)?.length === 1 ? `0${n.toString(16)}` : n.toString(16))).join(':');
  }
}

export class IpAddress {
  components: number[] = [];

  constructor(buf: Buffer) {
    for (let i = 0; i < 4; i++) {
      this.components.push(buf.readUInt8(i));
    }
  }

  toString() {
    return this.components.join('.');
  }
}
