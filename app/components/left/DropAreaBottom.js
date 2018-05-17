import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

type DropAreaBottomProps = {
  connectDropTarget: any,
  isOver: boolean,
  isDragging: boolean
};
class DropAreaBottom extends Component<DropAreaBottomProps> {
  render() {
    const {
      connectDropTarget,
      isOver,
      isDragging
    } = this.props;
    const basicColor = isOver ? 'rgb(25, 153, 238)' : 'transparent';
    const backgroundColor = isDragging ? '' : basicColor;
    return connectDropTarget((
      <div
        style={{
          height: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 16,
        }}
      >
        <div
          style={{
            height: 4,
            backgroundColor,
            position: 'absolute',
            borderRadius: '0 0 0px 4px',
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
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
  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}
export default DropTarget('FolderItem', areaTarget, collect)(DropAreaBottom);
