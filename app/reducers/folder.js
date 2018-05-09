import { Map } from 'immutable';
import { SELECT_FOLDER } from '../actions/folder';

const folders = (state = new Map({}), action) => {
  if (action.type === SELECT_FOLDER) {
    return state.set('select_folder_id', action.id);
  }
  return state;
};

export default folders;
