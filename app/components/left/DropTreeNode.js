import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

type DropTreeNodeType = {
  connectDropTarget: any,
  isOver: boolean
};
class DropTreeNode extends Component<DropTreeNodeType> {
  render() {
    const {
      connectDropTarget
    } = this.props;
    return connectDropTarget((
      <div
        style={{
          display: 'inline-block',
          backgroundColor: this.props.isOver ? 'blue' : 'red',
          width: 120
        }}
      >
        233
      </div>
    ));
  }
}

const areaTarget = {
  drop(props, monitor) {
    console.log(monitor.getItem());
  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

export default DropTarget(['Image'], areaTarget, collect)(DropTreeNode);
