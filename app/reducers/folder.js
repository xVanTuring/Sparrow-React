import { List } from 'immutable';
import { SELECT_FOLDER, SET_FOLDERS, FOLDER_RENAMING } from '../actions/folder';
import { RESET_APP } from '../actions/app';
import { PRESET_FOLDER_ID } from '../components/center/Center';
// TODO: rename
export const selectFolder = (state = PRESET_FOLDER_ID[0], action) => {
  if (action.type === SELECT_FOLDER) {
    return action.id;
  }
  return state;
};
export const renamingFolder = (state = '', action) => {
  if (action.type === FOLDER_RENAMING) {
    return action.id;
  }
  return state;
}

export const folders = (state = List([]), action) => {
  if (action.type === SET_FOLDERS) {
    return List(action.folders);
  }
  if (action.type === RESET_APP) {
    return List(state);
  }
  return state;
};
