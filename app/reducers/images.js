import { Map } from 'immutable';
import { SELECT_IMAGE } from '../actions/image';

const images = (state = new Map({}), action) => {
  if (action.type === SELECT_IMAGE) {
    return state.set('select_image_id', action.id);
  }
  return state;
};
export default images;
