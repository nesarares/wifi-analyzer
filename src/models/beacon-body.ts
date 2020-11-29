// https://mrncciew.com/2014/10/08/802-11-mgmt-beacon-frame/
// https://www.oreilly.com/library/view/80211-wireless-networks/0596100523/ch04.html

import { OUI } from './address';

// Pages 137, 134, 130, 114

export enum GroupCipherSuiteType {
  UseGroupCipherSuite = 0,
  WEP40 = 1,
  TKIP = 2,
  // Reserved = 3
  CCMP = 4,
  WEP104 = 5,
  // Other is vendor specific
}

export enum AuthenticationCipherSuiteType {
  PMKCaching = 1,
  PreSharedKey = 2,
  // Other is vendor specific
}

interface SecurityInformation {
  version: number;
  groupCipherSuite: {
    oui: OUI;
    suiteType: number;
  };
  pairwiseCipherSuites: {
    oui: OUI;
    suiteType: number;
  }[];
  authenticationCipherSuites: {
    oui: OUI;
    suiteType: number;
  }[];
  RSNCapabilities: number;
}

const securityInformationToObject = (securityInfo: SecurityInformation) => {
  return {
    version: securityInfo.version,
    groupCipherSuite: {
      oui: securityInfo.groupCipherSuite.oui.toString(),
      suiteType: securityInfo.groupCipherSuite.suiteType,
    },
    pairwiseCipherSuites: securityInfo.pairwiseCipherSuites?.map((cipher) => ({
      oui: cipher.oui.toString(),
      suiteType: cipher.suiteType,
    })),
    authenticationCipherSuites: securityInfo.authenticationCipherSuites?.map((cipher) => ({
      oui: cipher.oui.toString(),
      suiteType: cipher.suiteType,
    })),
    RSNCapabilities: securityInfo.RSNCapabilities,
  };
};

const securityInformationToString = (securityInfo: SecurityInformation) => {
  let str = '';
  str += `    * Version : ${securityInfo.version}
  * Group cipher suite
    * OUI  : ${securityInfo.groupCipherSuite.oui.toString()}
    * Type : ${securityInfo.groupCipherSuite.suiteType}`;

  securityInfo.pairwiseCipherSuites.forEach((pairwiseCipherSuite) => {
    str += `
  * Pairwise cipher suite
    * OUI  : ${pairwiseCipherSuite.oui.toString()}
    * Type : ${pairwiseCipherSuite.suiteType}`;
  });

  securityInfo.authenticationCipherSuites.forEach((authCipherSuite) => {
    str += `
  * AKM cipher suite
    * OUI  : ${authCipherSuite.oui.toString()}
    * Type : ${authCipherSuite.suiteType}`;
  });
  return str;
};

export class BeaconBody {
  timestamp: bigint; // 8 bytes
  beaconInterval: number; // 2 bytes
  capabilityInfo: number; // 2 bytes
  ssid: string; // variable

  currentChannel?: number;
  rsn?: SecurityInformation;
  wpa?: SecurityInformation;
  vendorSpecificOUIs?: OUI[];

  constructor(private buf: Buffer) {
    this.timestamp = buf.readBigUInt64LE(0);
    this.beaconInterval = buf.readUInt16LE(8);
    this.capabilityInfo = buf.readUInt16LE(10);
    const ssidElementId = buf.readUInt8(12);
    const ssidLength = buf.readUInt8(13);
    this.ssid = buf.slice(14, 14 + ssidLength).toString('utf-8');

    let offset = 14 + ssidLength;
    while (offset < buf.byteLength) {
      const elemId = buf.readUInt8(offset);
      const elemLength = buf.readUInt8(offset + 1);
      const elem = buf.slice(offset + 2, offset + 2 + elemLength);

      // Incomplete buffer
      if (elem.byteLength < elemLength) return;

      switch (elemId) {
        case 3:
          // DS Parameter Set
          this.currentChannel = elem.readUInt8(0);
          break;
        case 48:
        case 221:
          try {
            // 48  : RSN (Robust Security Network) information
            // 221 : Vendor specific information
            let rsnOffset = 0;

            if (elemId === 221) {
              const vendor = new OUI(elem.slice(rsnOffset, rsnOffset + 3));
              if (!this.vendorSpecificOUIs) {
                this.vendorSpecificOUIs = [];
              }
              this.vendorSpecificOUIs.push(vendor);
              const vendorOUIType = elem.readUInt8(rsnOffset + 3);
              if (vendor.toString().toLowerCase() !== '00:50:f2' || vendorOUIType !== 1) {
                break;
              }
              rsnOffset += 4;
            }

            const version = elem.readUInt16LE(rsnOffset);
            rsnOffset += 2;

            const groupCipherSuite = {
              oui: new OUI(elem.slice(rsnOffset, rsnOffset + 3)),
              suiteType: elem.readUInt8(rsnOffset + 3),
            };
            rsnOffset += 4;

            const pairwiseCipherSuites: any[] = [];
            const pairwiseCiphersCount = elem.readUInt16LE(rsnOffset);
            rsnOffset += 2;

            for (let cipherIdx = 0; cipherIdx < pairwiseCiphersCount; cipherIdx++) {
              const cipher = {
                oui: new OUI(elem.slice(rsnOffset, rsnOffset + 3)),
                suiteType: elem.readUInt8(rsnOffset + 3),
              };
              pairwiseCipherSuites.push(cipher);
              rsnOffset += 4;
            }

            const authenticationCipherSuites: any[] = [];
            const authenticationCiphersCount = elem.readUInt16LE(rsnOffset);
            rsnOffset += 2;

            for (let cipherIdx = 0; cipherIdx < authenticationCiphersCount; cipherIdx++) {
              const cipher = {
                oui: new OUI(elem.slice(rsnOffset, rsnOffset + 3)),
                suiteType: elem.readUInt8(rsnOffset + 3),
              };
              authenticationCipherSuites.push(cipher);
              rsnOffset += 4;
            }

            let RSNCapabilities = 0;
            if (elemId === 48) {
              RSNCapabilities = elem.readUInt16BE(rsnOffset);
              rsnOffset += 2;
            }

            const obj = {
              version,
              groupCipherSuite,
              pairwiseCipherSuites,
              authenticationCipherSuites,
              RSNCapabilities,
            };

            if (elemId === 221) {
              this.wpa = obj;
            } else {
              this.rsn = obj;
            }
          } catch (error) {
            console.error(error);
            console.log(this.ssid);
            console.log(buf.slice(offset, offset + 2 + elemLength).toString('hex'));
          }
          break;
      }

      offset = offset + 2 + elemLength;
    }
  }

  get length(): number {
    return 0;
  }

  toString() {
    let str = `Beacon body ==========================
  * Timestamp       : ${this.timestamp} us 
  * Beacon Interval : ${this.beaconInterval}
  * SSID            : ${this.ssid}
  * Current channel : ${this.currentChannel}`;
    if (this.vendorSpecificOUIs) {
      str += `
  * Vendors`;
      this.vendorSpecificOUIs.forEach((vendor) => {
        str += `
    * ${vendor.toString()}`;
      });
    }
    if (this.rsn) {
      str += `
  * RSN
${securityInformationToString(this.rsn)}`;
    }
    if (this.wpa) {
      str += `
  * WPA
${securityInformationToString(this.wpa)}`;
    }
    return str;
  }

  toObject() {
    return {
      timestamp: this.timestamp.toString(),
      beaconInterval: this.beaconInterval,
      capabilityInfo: this.capabilityInfo,
      ssid: this.ssid,
      currentChannel: this.currentChannel,
      rsn: this.rsn ? securityInformationToObject(this.rsn) : undefined,
      wpa: this.wpa ? securityInformationToObject(this.wpa) : undefined,
      vendorSpecificOUIs: this.vendorSpecificOUIs?.map(oui => oui.toString()),
    };
  }
}
