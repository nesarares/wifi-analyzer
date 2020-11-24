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

  toObject(): BeaconPacketObject {
    return {
      radiotapHeader: this.radiotapHeader.toObject(),
      macHeader: this.macHeader.toObject(),
      body: this.body.toObject(),
    };
  }
}


export interface BeaconPacketObject {
  radiotapHeader: {
    version: number;
    pad: number;
    len: number;
    present: number;
    channel:
      | {
          frequency: number;
          flags: {
            turbo: boolean;
            CCK: boolean;
            OFDM: boolean;
            TwoGhz: boolean;
            FiveGhz: boolean;
            passiveScan: boolean;
            dynamic: boolean;
            GFSK: boolean;
          };
        }
      | undefined;
    antennaSignal: number | undefined;
  };
  macHeader: {
    frameControl: number;
    duration: number;
    destinationMac: string;
    sourceMac: string;
    bssid: string;
    seqCtl: number;
  };
  body: {
    timestamp: string;
    beaconInterval: number;
    capabilityInfo: number;
    ssid: string;
    currentChannel: number | undefined;
    rsn:
      | {
          version: number;
          groupCipherSuite: {
            oui: string;
            suiteType: number;
          };
          pairwiseCipherSuites: {
            oui: string;
            suiteType: number;
          }[];
          authenticationCipherSuites: {
            oui: string;
            suiteType: number;
          }[];
          RSNCapabilities: number;
        }
      | undefined;
    wpa:
      | {
          version: number;
          groupCipherSuite: {
            oui: string;
            suiteType: number;
          };
          pairwiseCipherSuites: {
            oui: string;
            suiteType: number;
          }[];
          authenticationCipherSuites: {
            oui: string;
            suiteType: number;
          }[];
          RSNCapabilities: number;
        }
      | undefined;
    vendorSpecificOUIs: string[] | undefined;
  };
}
