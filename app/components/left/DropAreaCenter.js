import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { FolderType } from '../../types/app';

type DropAreaCenterProps = {
  connectDropTarget: any,

  isOver: boolean,
  item: FolderType,
  isHover: boolean,
  selectedFolder: string,
  isDragging: boolean
};
class DropAreaCenter extends Component<DropAreaCenterProps> {
  render() {
    const {
      connectDropTarget,

      isOver,
      item,
      isHover,
      selectedFolder,
      isDragging
    } = this.props;
    const hoverColor = (isHover ? 'rgba(192, 192, 192, 0.2)' : '');
    const selectedColor = (selectedFolder === item.id ? 'rgba(192, 192, 192, 0.3)' : hoverColor);
    const overColor = isOver ? 'rgb(25, 153, 238)' : selectedColor;
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
          10
        </span>
      </div>
    ));
  }
}
const areaTarget = {
  drop(props, monitor) {
    console.log(monitor.getItem());
  },
  canDrop(props) {
    if (props.isDragging) {
      return false;
    }
    return true;
  }
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}
export default DropTarget(['FolderItem', NativeTypes.FILE], areaTarget, collect)(DropAreaCenter);
