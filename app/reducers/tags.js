import { Set } from 'immutable';
// import { RESET_APP } from '../actions/app';
import { SET_TAGS } from '../actions/tags';

const tags = (state = Set([]), action) => {
  if (action.type === SET_TAGS) {
    return Set(action.tags);
  }
  // if (action.type === RESET_APP) {
  //   return Set([state]);
  // }
  return state;
};
export default tags;
