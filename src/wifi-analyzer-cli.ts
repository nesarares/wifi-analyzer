import { constants } from './utils/constants';
import { WifiAnalyzer } from './wifi-analyzer';

const wifiAnalyzer = new WifiAnalyzer(constants.DEVICE);
wifiAnalyzer.run();
