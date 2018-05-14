import _ from 'lodash';
import { FolderType } from '../types/app';

export const ROOT = 'ROOT';
const updateFolders = (folders: FolderType[], parent = ROOT, parentNode = null) => {
  folders.forEach(item => {
    item.parent = parent;
    item.collapsed = false;
    item.childrenId = [];
    if (parentNode != null) {
      parentNode.childrenId.push(item.id);
    }
    if (item.children) {
      updateFolders(item.children, item.id, item);
    }
  });
};

export const mapToArr = (folders: FolderType[], arr, useCollapsed = false, useId = false) => {
  folders.forEach((item) => {
    if (useId) {
      arr.push(item.id);
    } else {
      arr.push(item);
    }

    if (item.children && (!useCollapsed || !item.collapsed)) {
      mapToArr(item.children, arr, useCollapsed, useId);
    }
  });
};
export const getTopNode = (folders: [], id) => {
  const arr = [];
  mapToArr(folders, [], true);
  for (let index = 0; index < arr.length; index += 1) {
    const element = arr[index];
    if (element.id === id) {
      if (index > 0) {
        return arr[index - 1];
      }
    }
  }
};
export const getSil = (id: string, folders: FolderType[]) => {
  const arr = [];
  mapToArr(folders, arr, false);
  const parent = findParent(id, arr);
  if (parent != null) {
    return parent.children;
  }
  const result = find(id, arr);
  if (result.parent === ROOT) {
    return folders;
  }
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
  const oldParent = find(source.parent, arr);

  const target = find(targetId, arr);

  if (oldParent != null && target != null) {
    oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
    oldParent.children.splice(oldParent.children.indexOf(source), 1);

    const grandId = target.parent;
    source.parent = grandId;
    if (grandId === ROOT) {
      const index = newState.indexOf(target);
      newState.splice(index + 1, 0, source);
    } else {
      const grand = find(grandId, arr);
      const index = grand.children.indexOf(target);
      grand.childrenId.splice(index + 1, 0, sourceId);
      grand.children.splice(index + 1, 0, source);
    }
  } else {
    console.error('NULL');
  }

  return newState;
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
  const oldParent = find(source.parent, arr);

  const target = find(targetId, arr);

  if (oldParent != null && target != null) {
    oldParent.childrenId.splice(oldParent.childrenId.indexOf(sourceId), 1);
    oldParent.children.splice(oldParent.children.indexOf(source), 1);

    const grandId = target.parent;
    source.parent = grandId;
    if (grandId === ROOT) {
      const index = newState.indexOf(target);

      newState.splice(index, 0, source);
    } else {
      const grand = find(grandId, arr);
      const index = grand.children.indexOf(target);
      grand.childrenId.splice(index, 0, sourceId);
      grand.children.splice(index, 0, source);
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
export const getTopOffset = (id, folders: []) => {
  const arr = [];
  mapToArr(folders, arr, true, true);
  return arr.indexOf(id);
};
export default updateFolders;

