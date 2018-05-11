import { List } from 'immutable';
import { SELECT_FOLDER, SET_FOLDERS } from '../actions/folder';
import { RESET_APP } from '../actions/app';

export const selectFolder = (state = 'ALL', action) => {
  if (action.type === SELECT_FOLDER) {
    return action.id;
  }
  return state;
};

export const folders = (state = List([]), action) => {
  if (action.type === SET_FOLDERS) {
    return List(action.folders);
  }
  if (action.type === RESET_APP) {
    return List(state);
  }
  return state;
};
