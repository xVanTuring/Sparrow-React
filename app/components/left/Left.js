import React, { Component } from 'react';
// import { generatefolder } from '../utils';
// import FolderItem from './FolderItem';
import FixedFolders from './FixedFolder';
import Folders from './Folders';


class Left extends Component {
  render() {
    return (
      <div
        className="right_border"
        style={{
          width: 230,
          height: '100vh',
          backgroundColor: '#535353'
        }}
      >
        <div
          className="bottom_border "
          style={{
            // width: 230,
            height: 32,
            background: '#535353',
            lineHeight: '32px',
            textAlign: 'left',
            paddingLeft: '12px',
            color: '#fff',
            fontSize: 12
          }}
        >
          Sparrow
        </div>
        <FixedFolders />
        <span
          style={{
            display: 'block',
            color: '#a0a0a0',
            fontSize: 10,
            // position: 'absolute',
            marginLeft: 12,
            marginTop: 8,
            textAlign: 'left'
          }}
        >Folder (11)
        </span>
        <Folders size={1} />
      </div>);
  }
}


export default Left;
