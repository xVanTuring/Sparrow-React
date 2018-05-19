// @flow
import { Set } from 'immutable';
import { ImageType, FolderType } from '../types/app';

const fs = require('fs');
const path = require('path');
const os = require('os');
const uuid = require('uuid/v1');
const gm = require('gm');
const thmclrx = require('thmclrx');
// TODO: delete some func
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
export const readTags = (cb: (res: { historyTag: string[] }) => void) => {
  fs.readFile(path.join(os.homedir(), 'Sparrow', 'tags.json'), (err, data) => {
    if (err == null) {
      cb(JSON.parse(data.toString()));
    }
  });
};
export const saveTags = (obj, cb) => {
  fs.writeFile(
    path.join(
      os.homedir(),
      'Sparrow',
      'tags.json'
    ),
    JSON.stringify(obj), (err) => {
      if (!err) {
        cb();
      }
    }
  );
};

export const saveFolders = (folders) => {
  readMeta((res) => {
    res.folders = folders;
    saveMeta(res, () => {
      console.log('Folder Saved');
    });
  });
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

export const addImages = (fileObjArr = [], targetPathId, cb: (imgMeta: ImageType) => void) => {
  addImage(fileObjArr, targetPathId, (imgObjs) => {
    cb(imgObjs);
  });
};
const addImage = (fileObjArr = [], targetPathId, cb: (res: ImageType) => void) => {
  if (fileObjArr.length > 0) {
    const fileObj = fileObjArr.pop();
    addImage(fileObjArr, targetPathId, cb);
    const id = uuid();
    const targetPath = path.join(os.homedir(), 'Sparrow', 'images', id);
    const targetImgPath = path.join(targetPath, fileObj.name);
    const targetMetaPath = path.join(targetPath, 'metadata.json');

    const thumbBaseName =
      `${targetImgPath.replace(path.extname(targetImgPath), '')}_thumb${path.extname(targetImgPath)}`;

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
                const imageMeta = {
                  ext: path.extname(targetImgPath).replace('.', ''),
                  folders,
                  height: 0,
                  width: 0,
                  id,
                  name: path.basename(targetImgPath).replace(path.extname(targetImgPath), ''),
                  size: fileObj.size,
                  isDeleted: false,
                  modificationTime: fileObj.lastModified,
                  palette: [],
                  tags: []
                };
                // TODO: file format
                const img = gm(targetImgPath);
                img.size((err6, size) => {
                  if (err6 == null) {
                    imageMeta.width = size.width;
                    imageMeta.height = size.height;
                    // TODO: make it better
                    img
                      .resize(600)
                      .write(thumbBaseName, (err4) => {
                        if (err4 == null) {
                          thmclrx.octree(thumbBaseName, 8, (err9, values) => {
                            if (err9 == null) {
                              imageMeta.palette = [
                                `#${values[0].color}`,
                                `#${values[1].color}`,
                                `#${values[2].color}`,
                                `#${values[3].color}`,
                                `#${values[4].color}`];
                              cb(imageMeta);
                              fs.writeFile(targetMetaPath, JSON.stringify(imageMeta), (err5) => {
                                if (err5 == null) {
                                  // TODO: test
                                  // cb(imageMeta);
                                }
                              });
                            } else {
                              console.error(err9);
                            }
                          });
                        }
                      });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
};
export const addImagesToFolder =
  (ids: string[], targetId, setFolder, cb: (imgMeta: ImageType) => void) => {
    addImageToFolder(ids, targetId, setFolder, (updatedItem: ImageType) => {
      cb(updatedItem);
    });
  };
export const addImageToFolder =
  (
    ids: string[],
    targetId: string, setFolder: boolean,
    cb: (updatedItem: ImageType) => void
  ) => {
    if (ids.length > 0) {
      const id = ids.pop();
      addImageToFolder(ids, targetId, setFolder, cb);
      readImageMeta(id, (imageMeta) => {
        if (setFolder) {
          imageMeta.folders = [targetId];
        } else {
          imageMeta.folders.push(targetId);
        }
        saveImageMeta(id, imageMeta, () => {
          cb(imageMeta);
        });
      });
    }
  };

export const addImageTag = (id, tag, cb: (imageMeta: ImageType, updatedHistTags?: any) => void) => {
  readImageMeta(id, (imageMeta) => {
    imageMeta.tags.push(tag);
    saveImageMeta(id, imageMeta, () => {
      addHistoryTags(tag, (updatedHistTags) => {
        cb(imageMeta, updatedHistTags);
      });
    });
  });
};
export const removeImageTag = (id, tag, cb: (imageMeta: ImageType) => void) => {
  readImageMeta(id, (imageMeta) => {
    const index = imageMeta.tags.indexOf(tag);
    if (index >= 0) {
      imageMeta.tags.splice(index, 1);
      saveImageMeta(id, imageMeta, () => {
        cb(imageMeta);
      });
    }
  });
};
const addHistoryTags = (tag, cb: (historyTags: string[]) => void) => {
  readTags((res) => {
    let tags = Set(res.historyTags);
    tags = tags.add(tag);
    res.historyTags = tags.toArray();
    console.log(res);
    saveTags(res, () => {
      cb(res.historyTags);
    });
  });
};
export const setImageName = (id, name, cb: (imageMeta: ImageType) => void) => {
  readImageMeta(id, (imgMeta) => {
    const basePath = path.join(os.homedir(), 'Sparrow', 'images', id);
    const imgPath = path.join(basePath, `${imgMeta.name}.${imgMeta.ext}`);
    const thumbPath = path.join(basePath, `${imgMeta.name}_thumb.${imgMeta.ext}`);

    const newImgPath = path.join(basePath, `${name}.${imgMeta.ext}`);
    const newThumbPath = path.join(basePath, `${name}_thumb.${imgMeta.ext}`);
    imgMeta.name = name;
    fs.rename(imgPath, newImgPath, (err) => {
      if (!err) {
        fs.rename(thumbPath, newThumbPath, (err2) => {
          if (!err2) {
            cb(imgMeta);
          }
        });
      }
    });
    saveImageMeta(id, imgMeta, () => {
    });
  });
};
export const setImageNames = (ids: [], names: [], cb) => {
  if (ids.length > 0) {
    const id = ids.pop();
    const name = names.pop();
    setImageNames(ids, names, cb);
    setImageName(id, name, (meta) => {
      cb(meta);
    });
  }
};
export const deleteImages = (ids, cb: (imgMeta: ImageType) => void) => {
  deleteImage(ids, (imgMeta) => {
    cb(imgMeta);
  });
};
const deleteImage = (ids: string[], cb: (imgMeta: ImageType) => void) => {
  if (ids.length > 0) {
    const id = ids.pop();
    deleteImages(ids, cb);
    readImageMeta(id, (imgMeta) => {
      imgMeta.isDeleted = true;
      saveImageMeta(id, imgMeta, () => {
        cb(imgMeta);
      });
    });
  }
};
