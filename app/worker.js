const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const encode = require('hashcode').hashCode;

// console.log(encode().value('/b/a/sparrow'));
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
    default:
      break;
  }
};

const createLibrary = (libraryPath, cb) => {
  const libraryMetaPath = path.join(libraryPath, 'metadata.json');
  const libraryTagPath = path.join(libraryPath, 'tags.json');
  const libraryImagesPath = path.join(libraryPath, 'images');
  const emptyMeta = {
    folders: []
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
    const folders = null;
    readMeta(metaFilePath, (meta) => {
      folders = meta.folders;
    });
  }
  postMessage({
    id: 'done-loadLibrary',
    data: {
      folders: []
    },
  });
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
