import React, { Component } from 'react';
import FolderItem from './FolderItem';

class Folders extends Component {
  render() {
    return (
      <div
        style={{
          marginTop: 8
        }}
      >
        <FolderItem title="Movie Posts" size={60} folderId="6" />
        <FolderItem title="Inderstry" size={230} folderId="7" />
        <FolderItem title="Cartoon" size={71} folderId="8" />
        <FolderItem
          title="City Style"
          size={340}
          folderId="9"
          subFolders={[
            {
              title: 'Photo',
              size: 123,
              level: 1,
              subFolders: [
                { title: 'Old', size: 20, level: 2 },
                { title: 'Abstract', size: 20, level: 2 },
                { title: 'Grey', size: 20, level: 2 }]
            },
            {
              title: 'Vector',
              size: 27,
              level: 1
            }]}
        />
        <FolderItem title="SpaceX" size={51} folderId="10" />
      </div>
    );
  }
}
export default Folders;
