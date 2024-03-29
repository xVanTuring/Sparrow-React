export const SELECT_FOLDER = 'SELECT_FOLDER';
export const ADD_FOLDER = 'ADD_FOLDER';
export const SET_FOLDERS = 'SET_FOLDERS';
export const FOLDER_RENAMING = 'FOLDER_RENAMING';
export function selectFolder(id) {
  return {
    type: SELECT_FOLDER,
    id
  };
}
export function addFolder(name, id, parentId) {
  return {
    type: ADD_FOLDER,
    name,
    id,
    parentId
  };
}
export function setFolders(folders: []) {
  return {
    type: SET_FOLDERS,
    folders
  };
}
export function setFolderRenaming(id) {
  return {
    type: FOLDER_RENAMING,
    id
  };
}

