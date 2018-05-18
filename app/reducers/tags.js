import { RESET_APP } from '../actions/app';
import { SET_TAGS } from '../actions/tags';

export const tags = (state = [], action) => {
  if (action.type === SET_TAGS) {
    return action.tags;
  }
  if (action.type === RESET_APP) {
    return state;
  }
  return state;
};
