import { SET_ALT } from '../actions/keys';

export const altKey = (state = false, action) => {
  if (action.type === SET_ALT) {
    return action.status;
  }
  return state;
};
// export const shiftKey = (state = false, action) => {
//   return state;
// };
