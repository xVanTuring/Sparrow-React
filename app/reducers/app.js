import { SET_INIT_STATUS } from "../actions/app";

export const initStatus = (status = true, action) => {
  if (action.type === SET_INIT_STATUS) {
    return action.status;
  }
  return status;
};
