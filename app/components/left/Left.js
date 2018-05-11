import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import FixedFolders from './FixedFolder';
import Folders from './Folders';
import { ImageModel } from '../center/Image';
import CreateFolder from './CreateFolder';

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
          backgroundColor: '#535353',
          position: 'relative'
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
        <div
          style={{
            height: 18,
            // backgroundColor: 'red'
          }}
        >
          <div
            style={{
              color: '#a0a0a0',
              fontSize: 10,
              lineHeight: '18px',
              marginLeft: 12,
              float: 'left',
              height: 18
            }}
          >Folder (11)
          </div>
          <CreateFolder />
        </div>
        <Folders />
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
