import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import FixedFolders from './FixedFolder';
import Folders from './Folders';
import { ImageModel } from '../center/Image';

type LeftProp = {
  connectDropTarget: any
};
class Left extends Component<LeftProp> {
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget((
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
      </div>));
  }
}

const areaTarget = {
  drop(props, monitor) {
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
export default DropTarget([ImageModel], areaTarget, collect)(Left);


// export default Left;
