import { List } from 'immutable';
import { SELECT_FOLDER, SET_FOLDERS } from '../actions/folder';

export const selectFolder = (state = '', action) => {
  if (action.type === SELECT_FOLDER) {
    return action.id;
  }
  return state;
};

export const folders = (state = List(), action) => {
  if (action.type === SET_FOLDERS) {
    return List(action.folders);
  }
  return state;
};
