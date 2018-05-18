export const SET_TAGS = 'SET_TAGS';
export const setTags = (tags: []) => {
  return {
    type: SET_TAGS,
    tags
  };
};
