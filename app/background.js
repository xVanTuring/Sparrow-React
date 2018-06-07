// @flow
import settings from 'electron-settings';
import _ from 'lodash';
import uuid from 'uuid/v1';
import async from 'async';
import randomWord from 'random-words';
import fse from 'fs-extra';
import path from 'path';
import gm from 'gm';
import palette from 'image-palette2';
import { ipcRenderer, remote } from 'electron';
import updateFolders from './utils/utils';
import { ImageType } from './types/app';


// const { app } = remote;
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
const updateImage = (id, data, concat = false, remove = false, cb) => {
  readImageMeta(id, (meta) => {
    let newImageMeta = {
      ...meta,
    };
    if (concat) {
      Object.keys(data).forEach(key => {
        if (newImageMeta[key] && newImageMeta[key] instanceof Array) {
          newImageMeta[key] = Array.from(new Set(newImageMeta[key].concat(data[key])));
        } else {
          newImageMeta[key] = data[key];
        }
      });
    } else if (remove) {
      Object.keys(data).forEach(key => {
        if (newImageMeta[key] && newImageMeta[key] instanceof Array) {
          if (newImageMeta[key].indexOf(data[key]) !== -1) {
            newImageMeta[key].splice(newImageMeta[key].indexOf(data[key]), 1);
          }
        }
      });
    } else {
      newImageMeta = {
        ...meta,
        ...data
      };
    }
    saveImageMeta(id, newImageMeta, () => {
      cb(newImageMeta, !!data.tags);
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
    ipcRenderer.send('imageAdded', imageMeta);
  });
};

const updateImageQueue = async.queue((task, callback) => {
  updateImage(task.id, task.data, task.concat, task.remove, (newImageMeta, updateTags) => {
    callback(newImageMeta, updateTags);
  });
}, 2);
const addToUpdateImageQueue = (id, data, concat = false, remove = false) => {
  updateImageQueue.push({
    id,
    data,
    concat,
    remove
  }, (newImageMeta, updateTags) => {
    console.log(updateTags);
    if (updateTags) {
      ipcRenderer.send('tagsUpdated');
    }
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
  if (setFolder) {
    images.forEach(img => {
      addToUpdateImageQueue(img, {
        folders,
        isDeleted: false
      });
    });
  } else {
    console.log('add Folder');
    images.forEach(img => {
      addToUpdateImageQueue(img, {
        folders,
        isDeleted: false
      }, true);
    });
  }
});
ipcRenderer.on('setImageName', (event, [imageId, newName]) => {
  readImageMeta(imageId, (meta) => {
    const oldName = meta.name;
    console.log('One');
    fse.rename(
      path.join(settings.get('rootDir'), 'images', imageId, `${oldName}.${meta.ext}`),
      path.join(settings.get('rootDir'), 'images', imageId, `${newName}.${meta.ext}`)
    ).then(() => {
      console.log('Two');
      return fse.rename(
        path.join(settings.get('rootDir'), 'images', imageId, `${oldName}_thumb.png`),
        path.join(settings.get('rootDir'), 'images', imageId, `${newName}_thumb.png`)
      );
    }).then(() => {
      console.log('Three');
      addToUpdateImageQueue(imageId, {
        name: newName
      });
      return true;
    }).catch((err) => {
      console.log('ERR', err);
    });
  });
});
ipcRenderer.on('deleteImageFolder', (event, [imageId, folderId]) => {
  addToUpdateImageQueue(imageId, {
    folders: folderId
  }, false, true);
});
ipcRenderer.on('setImageDeleted', (event, images: string[]) => {
  images.forEach(img => {
    addToUpdateImageQueue(img, {
      isDeleted: true
    });
  });
});
ipcRenderer.on('addImagesTag', (event, [ids, tag]) => {
  ids.forEach(id => {
    addToUpdateImageQueue(id, {
      tags: [tag]
    }, true, false);
  });
});
ipcRenderer.on('deleteImagesTag', (event, [ids, tag]) => {
  ids.forEach(id => {
    addToUpdateImageQueue(id, {
      tags: tag
    }, false, true);
  });
});
ipcRenderer.on('setAnno', (event, [ids, annotation]) => {
  ids.forEach(id => {
    addToUpdateImageQueue(id, {
      annotation
    });
  });
});
const initLibrary = () => {
  const rootDir = settings.get('rootDir');
  if (!rootDir || !fse.existsSync(path.join(rootDir, 'metadata.json'))) {
    ipcRenderer.send('go-welcome');
  } else {
    readMeta(rootDir, (meta) => {
      readImages(rootDir, (images) => {
        const tagSet = new Set();
        images.forEach(item => {
          item.tags.forEach(tag => {
            tagSet.add(tag);
          });
        });
        updateFolders(meta.folders);
        ipcRenderer.send('done-loadLibrary', {
          folders: meta.folders,
          images,
          initStatus: false,
          tags: Array.from(tagSet)
        });
      });
    });
  }
};
initLibrary();
ipcRenderer.on('reload-library', () => {
  initLibrary();
});
