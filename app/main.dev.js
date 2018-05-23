/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import settings from 'electron-settings';


const path = require('path');

app.setName('Sparrow');
app.setPath('userData', path.join(app.getPath('appData'), app.getName()));

let mainWindow: BrowserWindow;
let backgroundWindow: BrowserWindow;
// const shouldQuit = app.makeSingleInstance((cmd, workDir) => {
//   if (mainWindow && !mainWindow.isDestroyed()) {
//     if (mainWindow.isMinimized()) {
//       mainWindow.restore();
//     }
//     mainWindow.show();
//     mainWindow.focus();
//   }
// });
// if (shouldQuit) {
//   app.quit();
// }
ipcMain.on('go-welcome', () => {
  console.log('Ipc Main ', 'go-welcome');
  mainWindow.webContents.send('go-welcome');
});
ipcMain.on('createLibrary', (event, libraryPath) => {
  backgroundWindow.webContents.send('createLibrary', libraryPath);
});
ipcMain.on('done-loadLibrary', (event, data) => {
  mainWindow.webContents.send('done-loadLibrary', data);
});
ipcMain.on('setFolders', (event, folders) => {
  backgroundWindow.webContents.send('setFolders', folders);
});
// [fileObjs, targetFolder]
ipcMain.on('addImages', (event, data) => {
  backgroundWindow.webContents.send('addImages', data);
});
ipcMain.on('imageAdded', (event, imageMeta) => {
  mainWindow.webContents.send('imageAdded', imageMeta);
});
// [e.dragData.images, e.dropId, !this.props.altKey]
ipcMain.on('addImagesToFolder', (event, data) => {
  backgroundWindow.webContents.send('addImagesToFolder', data);
});
ipcMain.on('imageUpdated', (event, newImageMeta) => {
  mainWindow.webContents.send('imageUpdated', newImageMeta);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

let tray = null;

app.on('ready', async () => {
  initSettings();
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  createTray();
  mainWindow = new BrowserWindow({
    icon: `${__dirname}/dist/icon_small.png`,
    show: false,
    width: 1024,
    height: 728,
    backgroundColor: '#535353',
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    // mainWindow.show();
  });
  mainWindow.webContents.on('dom-ready', () => {
    if (!backgroundWindow) {
      createBackgroundWindow();
    } else {
      backgroundWindow.send('reload-library');
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('will-navigate', (e) => {
    e.preventDefault();
  });
  // mainWindow.on('closed', () => {
  //   mainWindow = null;
  // });
});
function createTray() {
  if (tray && !tray.isDestroyed()) {
    tray.destroy();
  }
  const image = nativeImage.createFromPath(`${__dirname}/dist/icon.png`);
  tray = new Tray(image);
  tray.setToolTip('Sparrow');
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
        app.exit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
}

function initSettings() {
  const setting = settings.getAll();
  if (setting.tutorial == null) {
    settings.setAll({
      libraryHistory: [],
      tutorial: false,
      preferences: {
        showSubFolder: false,
      }
    });
  }
}
function createBackgroundWindow() {
  // http://www.lazyboy.site/2016/electron-note(3)/
  backgroundWindow = new BrowserWindow({
    // titleBarStyle: 'hidden-inset',
    // show: false,
    // resizable: false,
    // minimizable: false,
    // maximizable: false,
    // fullscreenable: false,
    // focusable: false,
    width: 200,
    height: 200,
  });
  backgroundWindow.loadURL(`file://${__dirname}/background.html`);
  backgroundWindow.on('close', (e) => {
    e.preventDefault();
    backgroundWindow.blur();
    backgroundWindow.hide();
  });
}
