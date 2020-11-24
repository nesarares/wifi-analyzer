import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { WifiAnalyzer } from './wifi-analyzer';

const device = 'wlp8s0mon';
const wifiAnalyzer = new WifiAnalyzer(device);
wifiAnalyzer.run();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'analyzer-ui/preload.js'),
    },
    width: 600,
  });

  mainWindow.loadFile(path.join(__dirname, 'analyzer-ui/index.html'));

  const webContents = mainWindow.webContents;
  wifiAnalyzer.onPacket((packet) => {
    webContents.send('packet', packet);
  });

  // webContents.openDevTools();
}

app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
