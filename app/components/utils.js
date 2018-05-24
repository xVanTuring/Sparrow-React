import { List } from 'immutable';

const arrDiff = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) {
    return true;
  }
  for (let index = 0; index < arr1.length; index += 1) {
    const element1 = arr1[index];
    if (element1 !== arr2[index]) {
      return true;
    }
  }
  return false;
};
export const listDiff = (list: List, list2: List) => {
  if (list.size !== list2.size) {
    return true;
  }
  for (let index = 0; index < list.size; index += 1) {
    const element = list.get(index);
    if (element !== list2.get(index)) {
      return true;
    }
  }
  return false;
};
export default arrDiff;
