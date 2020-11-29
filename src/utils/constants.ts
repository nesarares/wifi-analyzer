export const constants = {
  DEVICE: process.env.WIFI_DEVICE || 'wlp8s0',
  LOG_FILE_PATH: process.env.LOGS_PATH || 'logs/run.log',
  ANALYZER_FILTER: process.env.PCAP_FILTER || 'type mgt subtype beacon',
  SNIFFER_FILTER: process.env.PCAP_FILTER || 'tcp',
  CHANGE_WIFI_CHANNEL_INTERVAL: 250, // ms
};
