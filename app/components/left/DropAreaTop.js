import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

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
export default DropTarget('FolderItem', areaTarget, collect)(DropAreaTop);
