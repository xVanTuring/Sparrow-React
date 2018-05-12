import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { ImageModel } from '../center/Image';
// import { FolderModel } from './FolderItem'; ??

const { ipcRenderer } = require('electron');

type AreaProp = {
  connectDropTarget: any,
  isOver: boolean,
  // isOverCurrent: boolean,
  canDrop: boolean,
  selfDragging: boolean,
  fixedFolder?: boolean,
  id: string
  // itemType?: string
};
class FolderDropArea extends Component<AreaProp> {
  render() {
    const {
      connectDropTarget,
      isOver,
      canDrop,
      selfDragging,
    } = this.props;
    return connectDropTarget(<div
      className="drop_indicator"
      style={{
        backgroundColor: `rgba(55, 183, 230, ${!selfDragging && isOver && canDrop ? '0.2' : '0'})`,
        position: 'absolute',
        left: 0,
        right: 8,
        top: 0,
        bottom: 0,
        borderRadius: '4px',
        border: `1px solid rgba(55, 183, 230, ${!selfDragging && isOver && canDrop ? '0.8' : '0'})`,
      }}
    />);
  }
}

const areaTarget = {
  drop(props, monitor) {
    // use ctrl to copy to other folder,
    // should always have from folder id in case we want move only ,not effect others
    if (monitor.getItem().images != null) {
      ipcRenderer.send('addImagesToFolder', [monitor.getItem().images.toArray(), props.id, true]);
    }
  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}
export default DropTarget(
  [ImageModel, 'FolderItem', NativeTypes.FILE],
  areaTarget, collect
)(FolderDropArea);

