import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { FolderType } from '../../types/app';
import { ImageModel } from '../center/Image';
import { PRESET_FOLDER_ID } from '../center/Center';

type DropAreaCenterProps = {
  connectDropTarget: any,

  isOver: boolean,
  item: FolderType,
  isHover: boolean,
  selectedFolder: string,
  isDragging: boolean,
  onDropFolder?: Function,
  size: number
};
class DropAreaCenter extends Component<DropAreaCenterProps> {
  render() {
    const {
      connectDropTarget,

      isOver,
      item,
      isHover,
      selectedFolder,
      isDragging,
      onDropFolder,
      size
    } = this.props;
    const hoverColor = (isHover ? 'rgba(192, 192, 192, 0.2)' : '');
    const selectedColor = (selectedFolder === item.id ? 'rgba(192, 192, 192, 0.3)' : hoverColor);
    const overColor = (isOver && onDropFolder) ? 'rgb(25, 153, 238)' : selectedColor;
    const backgroundColor = isDragging ? '' : overColor;
    return connectDropTarget((
      <div
        style={{
          color: 'white',
          backgroundColor,
          borderRadius: 4,
          lineHeight: '32px',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 12,
          right: 0,
          textAlign: 'left',
          paddingLeft: 4,
          WebkitTransition: ' all .2s'
        }}
      >
        {item.name}
        <span
          style={{
            float: 'right',
            marginRight: 12
          }}
        >
          {size}
        </span>
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
        type: 'CenterDrop'
      });
    }
  }
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}
const calcType = (props) => {
  if (props.item.id === PRESET_FOLDER_ID[0] || props.isDragging || (!props.onDropFolder)) {
    return [];
  }
  if (props.item.id === PRESET_FOLDER_ID[3]) {
    return ['FolderItem', ImageModel];
  }
  return ['FolderItem', NativeTypes.FILE, ImageModel];
};
export default DropTarget(calcType, areaTarget, collect)(DropAreaCenter);
