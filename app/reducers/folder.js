
import { SELECT_FOLDER, SET_FOLDERS } from '../actions/folder';
import { RESET_APP } from '../actions/app';


export const selectedFolder = (state = '', action) => {
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
  if (action.type === 'MoveAfter') {

  }
  if (action.type === 'MoveAppend') {

  }
  return state;
};

