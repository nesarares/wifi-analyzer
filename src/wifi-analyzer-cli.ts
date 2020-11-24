import { WifiAnalyzer } from './wifi-analyzer';

const device = process.argv[2] || 'wlp8s0mon';

const wifiAnalyzer = new WifiAnalyzer(device);
wifiAnalyzer.run();
