import { SET_INIT_STATUS, INCREASE_LAYOUT_INDEX } from '../actions/app';

export const initStatus = (status = true, action) => {
  if (action.type === SET_INIT_STATUS) {
    return action.status;
  }
  return status;
};
export const layoutIndex = (status = 0, action) => {
  if (action.type === INCREASE_LAYOUT_INDEX) {
    return status + 1;
  }
  return status;
};
