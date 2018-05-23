// import { Set } from 'immutable';
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const uuid = require('uuid/v1');
const async = require('async');
const gm = require('gm');
const palette = require('image-palette');
const encode = require('hashcode').hashCode;

let configPath = null;
let cachePath = null;
onmessage = (msg) => {
  switch (msg.data.id) {
    case 'loadLibrary':
      loadLibrary(msg);
      break;
    case 'setDefaultValue':
      configPath = msg.data.data.configPath;
      cachePath = path.join(configPath, 'sparrow-cache');
      console.log(cachePath);
      break;
    case 'createLibrary':
      createLibrary(msg.data.data.libraryPath, () => {
        postMessage({
          id: 'done-createLibrary'
        });
      });
      break;
    case 'saveFolders':
      saveMeta(
        path.join(msg.data.data.metaPath, 'metadata.json')
        , msg.data.data.metaObj, () => {
          console.log('folderSaved');
        }
      );
      break;
    default:
      break;
  }
};

const processQueue = async.queue((task, callback) => {
  addImage(task.file, () => {
    return callback();
  });
});
const addToProcessQueue = (file) => {
  processQueue.push({
    file
  }, (res) => {
    const end = new Date().getTime();
    console.log((end - start) + "ms");
  });
};
const addImage = (file, cb) => {
  const id = uuid();
  const targetPath = path.join('/home/xvan/Desktop', 'target', id);
  const targetImgPath = path.join(targetPath, path.basename(file));
  const thumbPath = path.join(targetPath, 'thumb.jpg');
  fs.mkdirSync(targetPath);
  fse.copySync(file, targetImgPath);
  gm(targetImgPath)
    .resize(600)
    .write(thumbPath, (err4) => {
      if (!err4) {
        palette(thumbPath, (colors) => {
          cb();
        }, 5);
      }
    });
};
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
const loadLibrary = (msg) => {
  const libraryPath = msg.data.data.libraryPath;
  const cacheMetaFilePath = path.join(cachePath, `${encode().value(libraryPath)}.json`);
  const metaFilePath = path.join(libraryPath, 'metadata.json');
  const exist = fse.existsSync(cacheMetaFilePath);
  if (exist) {
    readMeta(cacheMetaFilePath, (meta) => {

    });
  } else {
    readMeta(metaFilePath, (meta) => {
      readImages(path.join(libraryPath, 'images'), (imageItem) => {
        postMessage({
          id: 'done-loadLibrary',
          data: {
            folders: meta.folders,
            images: imageItem
          },
        });
      });
    });
  }
};
const readMeta = (metaPath, cb) => {
  fs.readFile(metaPath, (err, data) => {
    if (err == null) {
      cb(JSON.parse(data.toString()));
    }
  });
};
const saveMeta = (metaPath, obj, cb) => {
  fs.writeFile(
    metaPath,
    JSON.stringify(obj), (err) => {
      if (!err) {
        cb();
      }
    }
  );
};
const readImages = (imagesPath, cb) => {
  fs.readdir(imagesPath, (err, subs) => {
    readImage(imagesPath, subs, [], (arr) => {
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
    fs.stat(dirPath, (err, res) => {
      if (err == null) {
        if (res.isDirectory()) {
          const metaPath = path.join(dirPath, 'metadata.json');
          fs.exists(metaPath, (exists) => {
            if (exists) {
              fs.readFile(metaPath, (err2, buf) => {
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
