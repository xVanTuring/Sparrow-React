// @flow
const fs = require('fs');
const path = require('path');
const os = require('os');
const uuid = require('uuid/v1');
const _ = require('lodash');

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

type FolderType = {
  name: string,
  id: string,
  children: FolderType[]
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

export const addFolder = (name, parentId, cb: metaCallBack) => {
  const id = uuid();
  readMeta((res) => {
    if (parentId === '') {
      res.folders.push({
        id,
        name,
        children: []
      });
    } else {
      const ele = findFolder(parentId, res.folders);
      if (ele == null) {
        console.error('NULL FOLDER');
      } else {
        ele.children.push({
          id,
          name,
          children: []
        });
      }
    }
    saveMeta(res, () => {
      cb(res);
    });
  });
};

export const renameFolder = (id, newName, cb: metaCallBack) => {
  readMeta((res) => {
    const element = findFolder(id, res.folders);
    element.name = newName;
    saveMeta(res, () => {
      cb(res);
    });
  });
};
export const moveFolder = (id, targetParentId, cb: metaCallBack) => {
  readMeta((res) => {
    let oldParent = null;
    let targetParent = null;
    let source = null;
    if (targetParentId === '') {
      targetParent = '';
    } else {
      targetParent = findFolder(targetParentId, res.folders);
    }
    // source = findFolder(id, res.folders);
    if (targetParent == null) {
      cb(res);
      return;
    }
    oldParent = findParentFolder(id, res.folders) || '';
    if (oldParent === '') {
      source = _.remove(res.folders, (v) => v.id === id)[0];
    } else {
      source = _.remove(oldParent.children, (v) => v.id === id)[0];
    }
    if (targetParent !== '') {
      targetParent.children.push(source);
    } else {
      res.folders.push(source);
    }
    saveMeta(res, () => {
      cb(res);
    });
  });
};
const findParentFolder = (id, folders: FolderType[]) => {
  for (let index = 0; index < folders.length; index += 1) {
    const element = folders[index];
    const filtered = element.children.filter(item => {
      return item.id === id;
    });
    if (filtered.length === 1) {
      return element;
    }
    const res = findParentFolder(id, element.children);
    if (res != null) {
      return res;
    }
  }
};
const findFolder = (id, folders: FolderType[]) => {
  for (let index = 0; index < folders.length; index += 1) {
    const element = folders[index];
    if (element.id === id) {
      return element;
    }
    const res = findFolder(id, element.children);
    if (res != null) {
      return res;
    }
  }
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

