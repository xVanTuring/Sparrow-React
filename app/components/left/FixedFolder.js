import React, { Component } from 'react';
import FolderItem from './FolderItem';
import { PRESET_FOLDER_ID } from '../center/Center';

class FixedFolders extends Component {
  render() {
    return (
      <div
        style={{
          marginTop: 12
        }}
      >
        <FolderItem name="All" size={0} id={PRESET_FOLDER_ID[0]} fixedFolder />
        <FolderItem name="Un-Cate" size={377} id={PRESET_FOLDER_ID[1]} fixedFolder />
        <FolderItem name="Un-Tag" size={231} id={PRESET_FOLDER_ID[2]} fixedFolder />
        <FolderItem name="Trash" size={11} id={PRESET_FOLDER_ID[3]} fixedFolder />
      </div>
    );
  }
}
export default FixedFolders;
