// @flow
const fs = require('fs');
const path = require('path');
const os = require('os');
const uuid = require('uuid/v1');
// const _ = require('lodash');

type metaCallBack = (res: { folders: FolderType[] }) => void;

export const readMeta = (cb: metaCallBack) => {
  fs.readFile(path.join(os.homedir(), 'Sparrow', 'metadata.json'), (err, data) => {
    if (err == null) {
      cb(JSON.parse(data.toString()));
    }
  });
};
export const saveMeta = (obj, cb) => {
  fs.writeFile(
    path.join(
      os.homedir(),
      'Sparrow',
      'metadata.json'
    ),
    JSON.stringify(obj), (err) => {
      if (!err) {
        cb();
      }
    }
  );
};

const readImageMeta = (id, cb: (res: ImageType) => void) => {
  fs.readFile(path.join(os.homedir(), 'Sparrow', 'images', id, 'metadata.json'), (err, buf) => {
    // const obj: ImageType = buf.toString();
    if (err == null) {
      cb(JSON.parse(buf.toString()));
    }
  });
};
const saveImageMeta = (id, obj, cb) => {
  fs.writeFile(path.join(os.homedir(), 'Sparrow', 'images', id, 'metadata.json'), JSON.stringify(obj), (err) => {
    if (err == null) {
      cb();
    }
  });
};

export const readImages = (cb) => {
  const targetpath = path.join(os.homedir(), 'Sparrow', 'images');
  fs.readdir(targetpath, (err, subs) => {
    readImage(subs, [], (arr) => {
      if (cb) {
        cb(arr);
      }
    });
  });
};
const readImage = (dirPaths, arr, cb) => {
  if (dirPaths.length > 0) {
    let dirPath = dirPaths.pop();
    dirPath = path.join(os.homedir(), 'Sparrow', 'images', dirPath);
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
                readImage(dirPaths, arr, cb);
              });
            } else {
              readImage(dirPaths, arr, cb);
            }
          });
        }
      }
    });
  } else {
    cb(arr);
  }
};

export const addImages = (fileObjArr = [], targetPathId, cb) => {
  addImage(fileObjArr, [], targetPathId, (imgObjs) => {
    cb(imgObjs);
  });
};
const addImage = (fileObjArr = [], arr, targetPathId, cb) => {
  if (fileObjArr.length > 0) {
    const fileObj = fileObjArr.pop();
    const id = uuid();
    const targetPath = path.join(os.homedir(), 'Sparrow', 'images', id);
    const targetImgPath = path.join(targetPath, fileObj.name);
    const targetMetaPath = path.join(targetPath, 'metadata.json');
    const folders = [];
    if (targetPathId !== '') {
      folders.push(targetPathId);
    }
    fs.mkdir(targetPath, (err) => {
      if (err == null) {
        fs.readFile(fileObj.path, (err2, data) => {
          if (err2 == null) {
            fs.writeFile(targetImgPath, data, (err3) => {
              if (err3 == null) {
                const imgObj = {
                  ext: path.extname(targetImgPath).replace('.', ''),
                  folders,
                  height: 1234,
                  width: 2345,
                  id,
                  name: path.basename(targetImgPath).replace(path.extname(targetImgPath), ''),
                  size: fileObj.size,
                  isDeleted: false,
                  modificationTime: fileObj.lastModified
                };
                fs.writeFile(targetMetaPath, JSON.stringify(imgObj), (err4) => {
                  if (err4 == null) {
                    arr.push(imgObj);
                  }
                  addImage(fileObjArr, arr, targetPathId, cb);
                });
              }
            });
          }
        });
      }
    });
  } else if (cb) {
    cb(arr);
  }
};
type ImageType = {
  name: string,
  size: number,
  modificationTime: number,
  folders: string[],
  width: number,
  height: number,
  isDeleted: boolean,
  ext: string
  // tags: string[]
};
export const addImagesToFolder = (ids: string[], targetId, setFolder, cb) => {
  addImageToFolder(ids, targetId, setFolder, [], (updatedItem: ImageType[]) => {
    // TODO: use cb
    cb(updatedItem);
  });
};
export const addImageToFolder =
  (
    ids: string[],
    targetId: string, setFolder: boolean, updated: [],
    cb: (updatedItem: ImageType[]) => void
  ) => {
    if (ids.length > 0) {
      const id = ids.pop();
      readImageMeta(id, (res) => {
        if (setFolder) {
          res.folders = [targetId];
        } else {
          res.folders.push(targetId);
        }
        updated.push(res);
        saveImageMeta(id, res, () => {
          addImageToFolder(ids, targetId, setFolder, updated, cb);
        });
      });
    } else {
      cb(updated);
    }
  };

