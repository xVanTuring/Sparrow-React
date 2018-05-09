import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import Image from './Image';
import DropArea from './DropArea';

type Prop = {
  images: any,
  connectDropTarget: any,
  isOver: boolean,
  // isOverCurrent: boolean,
  canDrop: boolean
  // itemType: any
};
class Center extends Component<Prop> {
  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;
    return connectDropTarget(<div
      className="right_border"
      style={{
        position: 'absolute',
        backgroundColor: '#535353',
        left: 230,
        right: 200,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        className="bottom_border"
        style={{
          height: 32,
          background: '#535353',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 32,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: '#303030',
          overflow: 'auto'
        }}
      >
        <Masonry
          style={{
            margin: '4px auto'
          }}
          options={{
            fitWidth: true,
          }}
        >
          {
            this.props.images.map((path) => {
              return <Image src={path} key={path} />;
            })
          }
        </Masonry>
      </div>
      <div
        className="drop_mask"
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: isOver && canDrop ? '' : 'none'
        }}
      >
        <DropArea />
      </div>
    </div>);
  }
}

export const PRESET_FOLDER_ID = ['ALL', 'UNCAT', 'UNTAG', 'TRASH'];
const filter = (imgs, folderId) => {

};
const mapStateToProps = (state) => {
  return {
    images: state.images
    // with filter
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const centerTarget = {
  drop(props, monitor) {
    // console.log(monitor.getItem());
    // if (props.onDrop) {
    //   props.onDrop(props, monitor);
    // }
  },
};
function collect(_connect, monitor) {
  // console.log(monitor.getItem());
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    // isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  };
}
const DropCenter = DropTarget([NativeTypes.FILE, NativeTypes.URL], centerTarget, collect)(Center);
export default connect(mapStateToProps, mapDispatchToProps)(DropCenter);

