import _ from 'lodash';
import uuid from 'uuid/v1';
import { ipcRenderer } from 'electron';
import { FolderType } from '../types/app';

export const ROOT = 'ROOT';
const updateFolders = (folders: FolderType[], parent = ROOT, parentNode = null) => {
  folders.forEach(item => {
    item.parent = parent;
    item.childrenId = [];
    if (parentNode != null) {
      parentNode.childrenId.push(item.id);
    }
    if (item.children) {
      updateFolders(item.children, item.id, item);
    }
  });
};
export const toFileData = (folders: FolderType[]) => {
  const newData = _.cloneDeep(folders);
  const arr: FolderType[] = [];
  mapToArr(newData, arr);
  arr.forEach((item) => {
    delete item.childrenId;
    delete item.collapsed;
    delete item.parent;
  });
  return newData;
};
export const mapToArr = (folders: FolderType[], arr, useId = false) => {
  folders.forEach((item) => {
    if (useId) {
      arr.push(item.id);
    } else {
      arr.push(item);
    }

    if (item.children) {
      mapToArr(item.children, arr, useId);
    }
  });
};
export const find = (id: string, arr: FolderType[]) => {
  for (let index = 0; index < arr.length; index += 1) {
    const element = arr[index];
    if (element.id === id) {
      return element;
    }
  }
};
export const findParent = (id: string, arr: FolderType[]) => {
  for (let index = 0; index < arr.length; index += 1) {
    const element = arr[index];
    if (element.childrenId != null) {
      if (element.childrenId.indexOf(id) >= 0) {
        return element;
      }
    }
  }
};

export const moveAfter = (sourceId, targetId, state: FolderType[]) => {
  const newState = _.cloneDeep(state);
  const arr = [];
  mapToArr(newState, arr);

  const source = find(sourceId, arr);
  const target = find(targetId, arr);

  if (target != null && target != null) {
    if (source.parent !== ROOT) {
      const oldParent = find(source.parent, arr);
      oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
      oldParent.children.splice(oldParent.children.indexOf(source), 1);
    } else {
      const index = newState.indexOf(source);
      newState.splice(index, 1);
    }
    const targetParentId = target.parent;
    source.parent = targetParentId;
    if (targetParentId === ROOT) {
      const index = newState.indexOf(target);
      newState.splice(index + 1, 0, source);
    } else {
      const targetParent = find(targetParentId, arr);
      const index = targetParent.children.indexOf(target);
      targetParent.childrenId.splice(index + 1, 0, sourceId);
      targetParent.children.splice(index + 1, 0, source);
    }
  } else {
    console.error('NULL');
  }

  return newState;
  // const newState = _.cloneDeep(state);
  // const arr = [];
  // mapToArr(newState, arr);

  // const source = find(sourceId, arr);
  // const oldParent = find(source.parent, arr);

  // const target = find(targetId, arr);

  // if (oldParent != null && target != null) {
  //   oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
  //   oldParent.children.splice(oldParent.children.indexOf(source), 1);

  //   const grandId = target.parent;
  //   source.parent = grandId;
  //   if (grandId === ROOT) {
  //     const index = newState.indexOf(target);
  //     newState.splice(index + 1, 0, source);
  //   } else {
  //     const grand = find(grandId, arr);
  //     const index = grand.children.indexOf(target);
  //     grand.childrenId.splice(index + 1, 0, sourceId);
  //     grand.children.splice(index + 1, 0, source);
  //   }
  // } else {
  //   console.error('NULL');
  // }

  // return newState;
};
export const moveAppend = (sourceId, targetId, state: FolderType[]) => {
  const newState = _.cloneDeep(state);
  const arr = [];
  mapToArr(newState, arr);

  const source = find(sourceId, arr);
  const target = find(targetId, arr);

  if (target != null && target != null) {
    if (source.parent !== ROOT) {
      const oldParent = find(source.parent, arr);
      oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
      oldParent.children.splice(oldParent.children.indexOf(source), 1);
    } else {
      newState.splice(newState.indexOf(source), 1);
    }

    source.parent = target.id;
    target.children.push(source);
    target.childrenId.push(sourceId);
  } else {
    console.error('NULL');
  }
  return newState;
};
export const moveBefore = (sourceId, targetId, state: FolderType[]) => {
  const newState = _.cloneDeep(state);
  const arr = [];
  mapToArr(newState, arr);

  const source = find(sourceId, arr);
  const target = find(targetId, arr);

  if (target != null && target != null) {
    if (source.parent !== ROOT) {
      const oldParent = find(source.parent, arr);
      oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
      oldParent.children.splice(oldParent.children.indexOf(source), 1);
    } else {
      const index = newState.indexOf(source);
      newState.splice(index, 1);
    }
    const targetParentId = target.parent;
    source.parent = targetParentId;
    if (targetParentId === ROOT) {
      const index = newState.indexOf(target);
      newState.splice(index, 0, source);
    } else {
      const targetParent = find(targetParentId, arr);
      const index = targetParent.children.indexOf(target);
      targetParent.childrenId.splice(index, 0, sourceId);
      targetParent.children.splice(index, 0, source);
    }
  } else {
    console.error('NULL');
  }

  return newState;
};
export const movePrepend = (sourceId, targetId, state: FolderType[]) => {
  const newState = _.cloneDeep(state);
  const arr = [];
  mapToArr(newState, arr);

  const source = find(sourceId, arr);
  const target = find(targetId, arr);

  if (target != null && target != null) {
    if (source.parent !== ROOT) {
      const oldParent = find(source.parent, arr);
      oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
      oldParent.children.splice(oldParent.children.indexOf(source), 1);
    } else {
      newState.splice(newState.indexOf(source), 1);
    }

    source.parent = target.id;
    target.children.splice(0, 0, source);
    target.childrenId.splice(0, 0, sourceId);
  } else {
    console.error('NULL');
  }
  return newState;
};
export default updateFolders;

export const setFolderName = (id, name, folders: []) => {
  const foldersC = _.cloneDeep(folders);
  const arr = [];
  mapToArr(foldersC, arr);
  for (let index = 0; index < arr.length; index += 1) {
    const element = arr[index];
    if (element.id === id) {
      element.name = name;
      break;
    }
  }
  return foldersC;
};
export const createNewFolder = (parentId, folders: FolderType[]) => {
  const newFolders = _.cloneDeep(folders);
  const id = uuid();
  const folderItem = {
    id,
    name: '--RENAME--',
    children: []
  };
  if (!parentId || parentId === '' || parentId === '--ALL--' || parentId === 'ROOT') {
    newFolders.push(folderItem);
  } else {
    const arr: FolderType[] = [];
    mapToArr(newFolders, arr);
    for (let index = 0; index < arr.length; index += 1) {
      const element = arr[index];
      if (element.id === parentId) {
        element.children.push(folderItem);
        break;
      }
    }
  }
  updateFolders(newFolders);
  return newFolders;
};
export const saveFoldersToFile = (folders) => {
  const fileData = toFileData(folders);
  ipcRenderer.send('setFolders', fileData);
};
