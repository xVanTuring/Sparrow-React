// @flow
const fs = require('fs');
const path = require('path');
const os = require('os');
const uuid = require('uuid/v1');

type metaCallBack = (res: { folders: FolderType[] }) => void;

export const readMeta = (cb: metaCallBack) => {
  fs.readFile(path.join(os.homedir(), 'Sparrow', 'metadata.json'), (err, data) => {
    if (err == null) {
      cb(JSON.parse(data.toString()));
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

type FolderType = {
  name: string,
  id: string,
  children: FolderType[]
};
export const addFolder = (name, parentId, cb: metaCallBack) => {
  const id = uuid();
  readMeta((res) => {
    console.log('readMetaDone');
    if (parentId === '') {
      res.folders.push({
        id,
        name,
        children: []
      });
    } else {
      for (let i = 0; i < res.folders.length; i += 1) {
        if (res.folders[i].id === parentId) {
          res.folders[i].children.push({
            id,
            name,
            children: []
          });
          break;
        }
      }
    }
    console.log('setMeta');
    console.log(res);
    saveMeta(res, () => {
      console.log('saveMetaDone');
      cb(res);
    });
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
        console.log('MetaData File Writing Done!');
        cb();
      }
    }
  );
};
export const renameFolder = (id, newName, cb: metaCallBack) => {
  readMeta((res) => {
    for (let index = 0; index < res.folders.length; index += 1) {
      const element = res.folders[index];
      if (element.id === id) {
        element.name = newName;
      }
    }
    saveMeta(res, () => {
      cb(res);
    });
  });
};
