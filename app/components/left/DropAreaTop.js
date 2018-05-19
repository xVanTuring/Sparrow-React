import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { PRESET_FOLDER_ID } from '../center/Center';

type DropAreaTopProps = {
  connectDropTarget: any,
  isOver: boolean,
  isDragging: boolean,
  onDropFolder?: Function
};
class DropAreaTop extends Component<DropAreaTopProps> {
  render() {
    const {
      connectDropTarget,
      isOver,
      isDragging,
      onDropFolder
    } = this.props;
    const basicColor = (isOver && onDropFolder) ? 'rgb(25, 153, 238)' : 'transparent';
    const backgroundColor = isDragging ? '' : basicColor;
    return connectDropTarget((
      <div
        style={{
          height: 8,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 16,
        }}
      >
        <div
          style={{
            height: 4,
            backgroundColor,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            borderRadius: '4px 0px 0 0 '
          }}
        />
      </div>
    ));
  }
}
const areaTarget = {
  drop(props, monitor) {
    if (props.onDropFolder) {
      props.onDropFolder({
        dropId: props.item.id,
        dragData: monitor.getItem(),
        type: 'TopDrop'
      });
    }
  },
  canDrop(props) {
    if (props.isDragging && props.onDropFolder) {
      return false;
    }
    return true;
  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}
const calcType = (props) => {
  if (props.item.id === PRESET_FOLDER_ID[0] ||
    props.item.id === PRESET_FOLDER_ID[3] ||
    props.isDragging || (!props.onDropFolder)) {
    return [];
  }
  return ['FolderItem'];
};
export default DropTarget(calcType, areaTarget, collect)(DropAreaTop);
