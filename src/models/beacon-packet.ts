import { BeaconBody } from './beacon-body';
import { MacHeader } from './mac-header';
import { RadiotapHeader } from './radiotap-header';

export class BeaconPacket {
  radiotapHeader: RadiotapHeader;
  macHeader: MacHeader;
  body: BeaconBody;

  constructor(buf: Buffer) {
    this.radiotapHeader = new RadiotapHeader(buf.slice(0));
    this.macHeader = new MacHeader(
      buf.slice(this.radiotapHeader.length, this.radiotapHeader.length + MacHeader.MAC_HEADER_LENGTH)
    );
    this.body = new BeaconBody(buf.slice(this.radiotapHeader.length + this.macHeader.length));
  }
}
