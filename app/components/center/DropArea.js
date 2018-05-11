import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

const { ipcRenderer } = require('electron');

type AreaProp = {
  connectDropTarget: any,
  isOver: boolean,
  isOverCurrent: boolean,
  canDrop: boolean,
  // itemType?: string
};
class DropArea extends Component<AreaProp> {
  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;
    return connectDropTarget(<div
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
    </div>);
  }
}

const areaTarget = {
  drop(props, monitor) {
    // addImages
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
      // console.log(JSON.stringify(filtered));
      ipcRenderer.send('addImages', [filtered, '']);
    }
  },
};
function collect(_connect, monitor) {
  // console.log(monitor.getItem());
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}
export default DropTarget([NativeTypes.FILE, NativeTypes.URL], areaTarget, collect)(DropArea);

