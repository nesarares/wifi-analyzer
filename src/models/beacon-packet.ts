import { BeaconBody } from './beacon-body';
import { MacHeader } from './mac-header';
import { RadiotapHeader } from './radiotap-header';

// https://mrncciew.com/2014/10/08/802-11-mgmt-beacon-frame/
export class BeaconPacket {
  radiotapHeader: RadiotapHeader;
  macHeader: MacHeader;
  body: BeaconBody;

  constructor(private buf: Buffer) {
    this.radiotapHeader = new RadiotapHeader(buf.slice(0));
    this.macHeader = new MacHeader(
      buf.slice(this.radiotapHeader.length, this.radiotapHeader.length + MacHeader.MAC_HEADER_LENGTH)
    );
    this.body = new BeaconBody(buf.slice(this.radiotapHeader.length + this.macHeader.length));
  }

  toObject() {
    return {
      radiotapHeader: this.radiotapHeader.toObject(),
      macHeader: this.macHeader.toObject(),
      body: this.body.toObject(),
    };
  }
}
