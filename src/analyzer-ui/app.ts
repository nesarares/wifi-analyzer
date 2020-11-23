const mapPacketToInfo = (packet: any) => ({
  signal: packet.radiotapHeader.antennaSignal,
  ssid: packet.body.ssid,
  mac: packet.macHeader.sourceMac,
  frequency: packet.radiotapHeader.channel.frequency,
  channel: packet.body.currentChannel,
  vendors: packet.body.vendorSpecificOUIs,
  ...(packet.body.rsn
    ? {
        rsn: {
          groupCipherSuite: packet.body.rsn.groupCipherSuite,
          akmCipherSuites: packet.body.rsn.authenticationCipherSuites,
        },
      }
    : {}),
  ...(packet.body.wpa
    ? {
        wpa: {
          groupCipherSuite: packet.body.wpa.groupCipherSuite,
          akmCipherSuites: packet.body.wpa.authenticationCipherSuites,
        },
      }
    : {}),
});


const makeCipherDiv = (name: string, cipher: any) => `
<div class="cipher">
	<p>${name}</p>
	<ul>
		<li>OUI: ${cipher.oui}</li>
		<li>Type: ${cipher.suiteType}</li>
	</ul>
</div>
`;

const makeSecurityDiv = (title: string, rsn: any) => `
	<h3>${title}</h3>
	${makeCipherDiv('Group cipher suite', rsn.groupCipherSuite)}
	${rsn.akmCipherSuites.map((suite: any) => makeCipherDiv('AKM cipher suite', suite)).join('\n')}
`;

const makeAPDiv = (ap: any) => {
  return `
	<div class="access-point">
		<div class="power">
			<div class="handle"></div>
			${ap.signal}
		</div>
		<div class="general-details">
			<h2>${ap.ssid}</h2>
			<p>MAC: ${ap.mac}</p>
			<p>Frequency: ${ap.frequency} MHz</p>
			<p>Channel: ${ap.channel}</p>
			<p>Vendors: ${ap.vendors.join(", ")}
		</div>
		<div class="security-details">
			${ ap.rsn ? makeSecurityDiv("RSN", ap.rsn) : ''}
			${ ap.wpa ? makeSecurityDiv("WPA", ap.wpa) : ''}
		</div>
	</div>
`;
};

const aps: any[] = [];
const path = window.require('path');
window.require(path.join(__dirname, "test-packets.json")).map(mapPacketToInfo).forEach((ap: any) => {
  if (!aps.some((a) => a.ssid === ap.ssid)) {
    aps.push(ap);
  }
});

document.getElementById("access-points")!.innerHTML = aps.map(makeAPDiv).join("\n");