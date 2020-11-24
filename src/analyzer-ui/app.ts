// import { BeaconPacketObject } from '../models/beacon-packet';
const { ipcRenderer } = window.require('electron');

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
  // <div class="access-point" id="${ap.mac}">
  const rotationDeg = mapNumberToRange(ap.signal, -90, -30, -220, 40);
  return `
    <div class="power">
      <div class="yellow"></div>
      <div class="red"></div>
      <div class="green"></div>
      <div class="clip"></div>
			<div class="handle" style="transform: rotate(${rotationDeg}deg)"></div>
			<span class="signal">${ap.signal}</span>
		</div>
		<div class="general-details">
			<h2 class="ssid">${ap.ssid}</h2>
			<p class="mac">MAC: ${ap.mac}</p>
			<p class="frequency">Frequency: ${ap.frequency} MHz</p>
			<p class="channel">Channel: ${ap.channel}</p>
			<p class="vendors">Vendors: ${ap.vendors.join(', ')}
		</div>
		<div class="security-details">
			${ap.rsn ? makeSecurityDiv('RSN', ap.rsn) : ''}
			${ap.wpa ? makeSecurityDiv('WPA', ap.wpa) : ''}
		</div>
    `;
  // </div>
};

let aps: any[] = [];
let canUpdateUi = false;
let firstPacket = false;
const apContainerDOM = document.getElementById('access-points');

const mapNumberToRange = (n: number, inputStart: number, inputEnd: number, outputStart: number, outputEnd: number) =>
  ((n - inputStart) * (outputEnd - outputStart)) / (inputEnd - inputStart) + outputStart;

const updateUi = () => {
  if (!canUpdateUi) return;
  canUpdateUi = false;
  console.log(aps);

  aps.forEach((ap) => {
    const apDOM = document.getElementById(ap.mac);
    if (!apDOM) {
      const apNode = document.createElement('div');
      apNode.id = ap.mac;
      apNode.classList.add('access-point');
      apNode.innerHTML = makeAPDiv(ap);
      apContainerDOM?.appendChild(apNode);
    } else {
      // Update fields
      const rotationDeg = mapNumberToRange(ap.signal, -90, -30, -220, 40);
      (apDOM.querySelector('.handle') as any).style.transform = `rotate(${rotationDeg}deg)`;
      apDOM.querySelector('.signal')!.textContent = ap.signal;
      apDOM.querySelector('.ssid')!.textContent = ap.ssid;
      apDOM.querySelector('.mac')!.textContent = `MAC: ${ap.mac}`;
      apDOM.querySelector('.frequency')!.textContent = `Frequency: ${ap.frequency} MHz`;
      apDOM.querySelector('.channel')!.textContent = `Channel: ${ap.channel}`;
      apDOM.querySelector('.vendors')!.textContent = `Vendors: ${ap.vendors.join(', ')}`;
      apDOM.querySelector('.security-details')!.innerHTML = `
        ${ap.rsn ? makeSecurityDiv('RSN', ap.rsn) : ''}
        ${ap.wpa ? makeSecurityDiv('WPA', ap.wpa) : ''}
      `;
    }
  });

  setTimeout(() => (canUpdateUi = true), 2000);
};

ipcRenderer.on('packet', (event: any, packet: any) => {
  const packetInfo = mapPacketToInfo(packet);
  const foundApIndex = aps.findIndex((ap) => ap.mac === packetInfo.mac);
  if (foundApIndex < 0) {
    aps.push(packetInfo);
  } else {
    aps[foundApIndex] = packetInfo;
  }

  if (!firstPacket) {
    firstPacket = true;

    setTimeout(() => {
      aps = aps.sort((a, b) => (a.signal > b.signal ? -1 : 1));
      canUpdateUi = true;
    }, 3000);
  }

  updateUi();
});

document.getElementById('download')!.onclick = () => {
  new Promise((resolve, reject) => {
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(aps)], {
        type: 'text/json',
      })
    );
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = 'access-points.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    resolve();
  });
};
