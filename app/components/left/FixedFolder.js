import React, { Component } from 'react';
import FolderItem from './FolderItem';

class FixedFolders extends Component {
  render() {
    return (
      <div
        style={{
          marginTop: 12
        }}
      >
        <FolderItem title="All" size={1034} folderId="1" />
        <FolderItem title="Un-Cate" size={377} folderId="2" />
        <FolderItem title="Un-Tag" size={231} folderId="3" />
        <FolderItem title="All Tags" size={57} folderId="4" />
        <FolderItem title="Trash" size={11} folderId="5" />
      </div>
    );
  }
}
export default FixedFolders;
