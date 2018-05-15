
import { SELECT_FOLDER, SET_FOLDERS } from '../actions/folder';
import { RESET_APP } from '../actions/app';
import { PRESET_FOLDER_ID } from '../components/center/Center';


export const selectedFolder = (state = PRESET_FOLDER_ID[0], action) => {
  if (action.type === SELECT_FOLDER) {
    return action.id;
  }
  return state;
};
export const folders = (state = [], action) => {
  if (action.type === SET_FOLDERS) {
    return action.folders;
  }
  if (action.type === RESET_APP) {
    return state;
  }
  return state;
};

