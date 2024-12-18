const { app, BrowserWindow, Tray, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

let tray = null;
let window = null;
let aboutWindow = null;

// Hide dock icon
if (process.platform === 'darwin') {
  app.dock.hide()
}

// Initialize store with schema
const store = new Store({
  schema: {
    launchAtLogin: {
      type: 'boolean',
      default: false
    }
  }
});

function createWindow() {
  window = new BrowserWindow({
    width: 250,
    height: 400,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  window.loadFile('menu.html');
}

function createAboutWindow() {
  // If there's an existing window, just focus it
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.focus();
    return;
  }

  aboutWindow = new BrowserWindow({
    width: 400,
    height: 150,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  aboutWindow.loadFile('about.html');

  // Clean up the window when it's closed
  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });
}

function toggleWindow() {
  if (window.isVisible()) {
    window.hide();
  } else {
    const trayPos = tray.getBounds();
    const windowPos = window.getBounds();
    const x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    const y = Math.round(trayPos.y + trayPos.height);

    window.setPosition(x, y);
    window.show();
  }
}

function createTray() {
  // Create the tray
  tray = new Tray(nativeImage.createEmpty());

  // Set an empty title to ensure the icon is visible
  tray.setTitle('');
  tray.setToolTip('APPNAME');

  // Try to load and set the icon
  const iconPath = path.join(__dirname, 'icon-menubar.png');
  if (fs.existsSync(iconPath)) {
    const icon = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 });
    tray.setImage(icon);
  }

  tray.on('click', toggleWindow);

  updateTimes();
  setInterval(updateTimes, 60000);
}

function updateLoginSettings() {
  if (!app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: store.get('launchAtLogin'),
      path: process.execPath,
      args: [path.resolve(process.argv[1])]
    });
  } else {
    app.setLoginItemSettings({
      openAtLogin: store.get('launchAtLogin')
    });
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  updateLoginSettings();
});

// IPC handlers
ipcMain.on('quit-app', () => {
  app.quit();
});


ipcMain.on('show-about', () => {
  createAboutWindow();
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    const windowPos = window.getBounds();
    aboutWindow.setPosition(windowPos.x + windowPos.width, windowPos.y);
    aboutWindow.show();
  }
});

// Launch at login handlers
ipcMain.on('get-launch-at-login-status', (event) => {
  event.reply('launch-at-login-status', store.get('launchAtLogin'));
});

ipcMain.on('toggle-launch-at-login', () => {
  const currentValue = store.get('launchAtLogin');
  store.set('launchAtLogin', !currentValue);
  updateLoginSettings();
  window.webContents.send('launch-at-login-status', !currentValue);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
