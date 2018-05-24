// @flow
import settings from 'electron-settings';
import _ from 'lodash';
import uuid from 'uuid/v1';
import async from 'async';
import fse from 'fs-extra';
import path from 'path';
import gm from 'gm';
import palette from 'image-palette2';
import { ipcRenderer, remote } from 'electron';
import updateFolders from './utils/utils';


const { app } = remote;
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
const readImageMeta = (id, cb: (res: ImageType) => void) => {
  fse.readFile(path.join(settings.get('rootDir'), 'images', id, 'metadata.json'), (err, buf) => {
    if (err == null) {
      cb(JSON.parse(buf.toString()));
    }
  });
};
const saveImageMeta = (id, obj, cb) => {
  fse.writeFile(path.join(settings.get('rootDir'), 'images', id, 'metadata.json'), JSON.stringify(obj), (err) => {
    if (err == null) {
      cb();
    }
  });
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
const addImage = (fileObj, folder, cb) => {
  const id = uuid();
  const filePath = fileObj.path;
  const fileName = fileObj.name;
  const fileSize = fileObj.size;
  const { lastModified } = fileObj;

  const targetPath = path.join(settings.get('rootDir'), 'images', id);
  const targetImgPath = path.join(targetPath, fileName);
  const thumbPath = path.join(targetPath, fileName.replace(path.extname(fileName), '_thumb.png'));
  const targetImageMetaPath = path.join(targetPath, 'metadata.json');

  fse.mkdirSync(targetPath);
  fse.copySync(filePath, targetImgPath);
  const imageMeta = {
    ext: path.extname(targetImgPath).replace('.', ''),
    folders: [],
    height: 0,
    width: 0,
    id,
    name: path.basename(targetImgPath).replace(path.extname(targetImgPath), ''),
    isDeleted: false,
    palette: [],
    tags: [],
    annotation: '',
    size: fileSize,
    lastModified
  };
  if (!folder && folder !== '' && folder !== 'ROOT' && folder !== '--ALL--') {
    imageMeta.folders.push(folder);
  }
  const img = gm(targetImgPath);
  img.size((err, dimen) => {
    if (err) {
      console.log(err);
    }
    imageMeta.width = dimen.width;
    imageMeta.height = dimen.height;

    img.resize(640)
      .write(thumbPath, (err4) => {
        if (!err4) {
          palette(thumbPath, (colors) => {
            imageMeta.palette = colors;
            fse.writeFileSync(targetImageMetaPath, JSON.stringify(imageMeta));
            cb(imageMeta);
          }, 5);
        }
      });
  });
};
const updateImage = (id, data, cb) => {
  readImageMeta(id, (meta) => {
    const newImageMeta = {
      ...meta,
      ...data
    };
    saveImageMeta(id, newImageMeta, () => {
      cb(newImageMeta);
    });
  });
};

const processQueue = async.queue((task, callback) => {
  addImage(task.file, task.parentFolder, (imageMeta) => {
    callback(imageMeta);
  });
}, 4);
const addToProcessQueue = (file, parentFolder) => {
  processQueue.push({
    file,
    parentFolder
  }, (imageMeta) => {
    console.log(processQueue.length);
    ipcRenderer.send('imageAdded', imageMeta);
  });
};

const updateImageQueue = async.queue((task, callback) => {
  updateImage(task.id, task.data, (newImageMeta) => {
    callback(newImageMeta);
  });
});
const addToUpdateImageQueue = (id, data) => {
  updateImageQueue.push({
    id,
    data
  }, (newImageMeta) => {
    console.log('Image Updated');
    console.log(newImageMeta);
    ipcRenderer.send('imageUpdated', newImageMeta);
  });
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
ipcRenderer.on('addImages', (event, [fileObjs, targetFolder]) => {
  console.log('addImages');
  fileObjs.forEach(file => {
    // console.log(file)
    addToProcessQueue(file, targetFolder);
  });
});
ipcRenderer.on('addImagesToFolder', (event, [images, targetFolder, setFolder]) => {
  const folders = [targetFolder];
  images.forEach(img => {
    addToUpdateImageQueue(img, {
      folders,
      isDeleted: false
    });
  });
});
ipcRenderer.on('setImageDeleted', (event, images: string[]) => {
  images.forEach(img => {
    addToUpdateImageQueue(img, {
      isDeleted: true
    });
  });
});
const initLibrary = () => {
  const rootDir = settings.get('rootDir');
  // console.log(rootDir);
  if (!rootDir || !fse.existsSync(path.join(rootDir, 'metadata.json'))) {
    ipcRenderer.send('go-welcome');
  } else {
    const cacheFile = path.join(app.getPath('userData'), 'cache');

    // console.log(cacheFile);
    readMeta(rootDir, (meta) => {
      readImages(rootDir, (images) => {
        updateFolders(meta.folders);
        ipcRenderer.send('done-loadLibrary', {
          folders: meta.folders,
          images,
          initStatus: false
        });
      });
    });
  }
};
initLibrary();
ipcRenderer.on('reload-library', () => {
  initLibrary();
});
