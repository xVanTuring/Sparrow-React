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
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import { readMeta, readImages, addImages, addImagesToFolder, saveFolders, addImageTag, removeImageTag, readTags, deleteImages, setImageName, setFolderName, addFolder } from './operation/operation';

const path = require('path');

app.setName('Sparrow');
app.setPath('userData', path.join(app.getPath('appData'), app.getName()));

let mainWindow = null;
ipcMain.on('setLibraryPath', (event, libraryPath) => {
  console.log('ipcMain ', libraryPath);
  event.sender.send('setLibraryPath', libraryPath);
});
// [imgPath] targetPath(id)
ipcMain.on('addImages', (event, arg) => {
  addImages(arg[0], arg[1], (imageMeta) => {
    event.sender.send('addImages', [imageMeta]);
  });
});
// ids[] targetId setFolder
ipcMain.on('addImagesToFolder', (event, arg) => {
  addImagesToFolder(arg[0], arg[1], arg[2], (updatedImageMeta) => {
    event.sender.send('updateImages', [[updatedImageMeta]]);
  });
});
ipcMain.on('saveFolders', (event, arg) => {
  saveFolders(arg[0]);
});
// id tag
ipcMain.on('addTag', (event, arg) => {
  addImageTag(arg[0], arg[1], (updatedImageMeta, updatedHistTags) => {
    event.sender.send('updateImages', [[updatedImageMeta], updatedHistTags]);
  });
});
ipcMain.on('removeTag', (event, arg) => {
  removeImageTag(arg[0], arg[1], (updatedImageMeta) => {
    event.sender.send('updateImages', [[updatedImageMeta]]);
  });
});
// ids:[]
ipcMain.on('deleteImages', (event, arg) => {
  console.log(arg[0]);
  deleteImages(arg[0], (updatedImageMeta) => {
    event.sender.send('updateImages', [[updatedImageMeta]]);
  });
});
// id name
ipcMain.on('setImageName', (event, arg) => {
  setImageName(arg[0], arg[1], (updatedImageMeta) => {
    event.sender.send('updateImages', [[updatedImageMeta]]);
  });
});
// id name
ipcMain.on('setFolderName', (event, arg) => {
  setFolderName(arg[0], arg[1], (folders) => {
    event.sender.send('setFolders', folders);
  });
});
// parentId
ipcMain.on('addFolder', (event, arg) => {
  addFolder(arg[0], (folders) => {
    event.sender.send('setFolders', folders);
  });
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


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
    // readMeta((projMeta) => {
    //   readImages((imgs) => {
    //     readTags((res) => {
    //       mainWindow.webContents.send('metaLoaded', {
    //         folders: projMeta.folders,
    //         images: imgs,
    //         basePath: path.join(os.homedir(), 'Sparrow'),
    //         historyTags: res.historyTags
    //       });
    //     });
    //   });
    // });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
