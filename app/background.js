// @flow
import settings from 'electron-settings';
import _ from 'lodash';
import fse from 'fs-extra';
import path from 'path';
import { ipcRenderer } from 'electron';
import updateFolders from './utils/utils';

const createLibrary = (libraryPath, cb) => {
  const libraryMetaPath = path.join(libraryPath, 'metadata.json');
  const libraryTagPath = path.join(libraryPath, 'tags.json');
  const libraryImagesPath = path.join(libraryPath, 'images');
  const emptyMeta = {
    folders: [],
    modificationTime: Date.now()
  };
  const emptyTags = {
    historyTags: []
  };
  fse.ensureDir(libraryImagesPath, (e) => {
    fse.writeFile(libraryMetaPath, JSON.stringify(emptyMeta), (e1) => {
      fse.writeFile(libraryTagPath, JSON.stringify(emptyTags), (e2) => {
        cb();
      });
    });
  });
};
const readMeta = (metaPath, cb) => {
  fse.readFile(path.join(metaPath, 'metadata.json'), (err, data) => {
    if (err == null) {
      cb(JSON.parse(data.toString()));
    }
  });
};
const saveMeta = (metaPath, obj, cb) => {
  fse.writeFile(
    path.join(metaPath, 'metadata.json'),
    JSON.stringify(obj), (err) => {
      if (!err) {
        cb();
      }
    }
  );
};
const readImages = (imagesPath, cb) => {
  fse.readdir(path.join(imagesPath, 'images'), (err, subs) => {
    readImage(path.join(imagesPath, 'images'), subs, [], (arr) => {
      if (cb) {
        cb(arr);
      }
    });
  });
};
const readImage = (imagesPath, subFolders, arr, cb) => {
  if (subFolders.length > 0) {
    let dirPath = subFolders.pop();
    dirPath = path.join(imagesPath, dirPath);
    fse.stat(dirPath, (err, res) => {
      if (err == null) {
        if (res.isDirectory()) {
          const metaPath = path.join(dirPath, 'metadata.json');
          fse.exists(metaPath, (exists) => {
            if (exists) {
              fse.readFile(metaPath, (err2, buf) => {
                if (err2 == null) {
                  const obj = JSON.parse(buf.toString());
                  arr.push(obj);
                }
                readImage(imagesPath, subFolders, arr, cb);
              });
            } else {
              readImage(imagesPath, subFolders, arr, cb);
            }
          });
        }
      }
    });
  } else {
    cb(arr);
  }
};

ipcRenderer.on('createLibrary', (event, libraryPath) => {
  console.log('createLibrary');
  createLibrary(libraryPath, () => {
    settings.set('rootDir', libraryPath);
    initLibrary();
  });
});
ipcRenderer.on('setFolders', (event, folders) => {
  readMeta(settings.get('rootDir'), (meta) => {
    const newMeta = _.cloneDeep(meta);
    newMeta.folders = folders;
    newMeta.modificationTime = Date.now();
    saveMeta(settings.get('rootDir'), newMeta, () => {

    });
  });
});

const initLibrary = () => {
  const rootDir = settings.get('rootDir');
  console.log(rootDir);
  if (!rootDir || !fse.existsSync(path.join(rootDir, 'metadata.json'))) {
    ipcRenderer.send('go-welcome');
  } else {
    console.log('done-loadLibrary');
    readMeta(rootDir, (meta) => {
      readImages(rootDir, (images) => {
        updateFolders(meta.folders);
        ipcRenderer.send('done-loadLibrary', {
          folders: meta.folders,
          images
        });
      });
    });
  }
};
initLibrary();
