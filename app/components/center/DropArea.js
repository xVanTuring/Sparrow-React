import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { NativeTypes } from 'react-dnd-html5-backend';
import { PRESET_FOLDER_ID } from './Center';

const { ipcRenderer } = require('electron');

type AreaProp = {
  connectDropTarget: any,
  isOver: boolean,
  canDrop: boolean,
  selectedFolder: string
};
class DropArea extends Component<AreaProp> {
  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;
    return connectDropTarget((
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          lineHeight: '90px',
          height: '90px',
          width: '280px',
          margin: 'auto',
          backgroundColor: isOver && canDrop ? '#4A86E8' : '#121212',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          color: 'white',
          borderRadius: 8
        }}
      >
        Drop Here!
      </div>
    ));
  }
}

const areaTarget = {
  drop(props, monitor) {
    if (monitor.getItem().files != null) {
      const filtered = monitor.getItem().files.map((item) => {
        if (item.type.indexOf('image') !== -1) {
          return {
            name: item.name,
            lastModified: item.lastModified,
            path: item.path,
            size: item.size,
            type: item.type
          };
        }
      });
      const targetFolder = (!props.selectedFolder ||
        props.selectedFolder === PRESET_FOLDER_ID[0] ||
        props.selectedFolder === PRESET_FOLDER_ID[3])
        ? '' : props.selectedFolder;
      ipcRenderer.send('addImages', [filtered, targetFolder]);
    }
  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}
const mapStateToProps = (state) => (
  {
    selectedFolder: state.selectedFolder
  }
);
const DropDropArea = DropTarget([NativeTypes.FILE, NativeTypes.URL], areaTarget, collect)(DropArea);
export default connect(mapStateToProps)(DropDropArea);
