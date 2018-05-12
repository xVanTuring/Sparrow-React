// @flow
export type ImageType = {
  name: string,
  size: number,
  modificationTime: number,
  folders: string[],
  width: number,
  height: number,
  isDeleted: boolean,
  ext: string
  // tags: string[]
};
export type FolderType = {
  name: string,
  id: string,
  children: FolderType[]
};

export type ProjectModel = {
  images: ImageType[],
  folders: FolderType[]
};
