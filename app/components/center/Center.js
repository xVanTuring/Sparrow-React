import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
// import AutoResponsive from 'autoresponsive-react';
import Image from './Image';
import DropArea from './DropArea';

type Prop = {
  images: any,
  connectDropTarget: any,
  isOver: boolean,
  // isOverCurrent: boolean,
  canDrop: boolean,
  basePath: string
  // itemType: any
};
class Center extends Component<Prop> {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      startMousePos: { x: 200, y: 32 },
      currentMousePos: { x: 200, y: 32 },
      offset: 0,
      updateCurrentMousePos: { x: 200, y: 32 },
    };
    this.scroller = null;
    this.initScrollTop = 0;
  }
  handleMouseDown = (e) => {
    const top = this.scroller.scrollTop;
    this.setState({
      isDragging: true,
      startMousePos: { x: e.clientX, y: e.clientY + top }
    });
    this.initScrollTop = top;
  }
  handleMouseMove = (e) => {
    // const top = this.scroller.scrollTop;
    this.setState({
      currentMousePos: { x: e.clientX, y: e.clientY + this.initScrollTop },
      // updateCurrentMousePos: { x: e.clientX, y: e.clientY + top }
    });
  }
  handleMouseUp = () => {
    this.setState({
      isDragging: false,
      offset: 0
    });
  }
  handleSroll = () => {
    const offset = this.scroller.scrollTop - this.initScrollTop;
    // const { currentMousePos } = this.state;
    // console.log(offset);
    if (this.state.isDragging) {
      this.setState({
        offset
      });
    }
  }
  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;
    const {
      isDragging,
      startMousePos,
      currentMousePos,
      offset
    } = this.state;

    // const offset2 = startMousePos.y < currentMousePos.y ? offset : -offset;
    const updatedY = currentMousePos.y + offset;
    const height = Math.abs(startMousePos.y - updatedY);
    const left = startMousePos.x < currentMousePos.x ?
      startMousePos.x : currentMousePos.x;
    const top = startMousePos.y < updatedY ?
      startMousePos.y : updatedY;
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
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        // onMouseLeave={this.handleMouseUp}
        onScroll={this.handleSroll}
        ref={(ref) => { this.scroller = ref; }}
      >
        <Masonry
          ref={(ref) => { this.scroller = ref; }}
          style={{
            margin: 'auto',
          }}
          options={{
            fitWidth: true,
          }}

        >
          {
            this.props.images.map((item) => {
              return (<Image
                src={`${this.props.basePath}/images/${item.id}/${item.name}.${item.ext}`}
                key={item.id}
                size={`${item.width}x${item.height}`}
                name={item.name}
              />);
            })
          }
        </Masonry>
        <div
          style={{
            position: 'absolute',
            left: left - 230,
            top: top - 32,
            width: Math.abs(startMousePos.x - currentMousePos.x),
            height,
            backgroundColor: 'rgba(58,201,223,0.44)',
            display: isDragging ? '' : 'none',
            border: '1px solid rgba(58,201,223,0.7)',
            pointerEvents: 'none',
            boxSizing: 'border-box',
          }}
        />
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
    </div >);
  }
}

export const PRESET_FOLDER_ID = ['ALL', 'UNCAT', 'UNTAG', 'TRASH'];
const filter = (imgs, folderId) => {

};
const mapStateToProps = (state) => {
  return {
    images: state.images,
    basePath: state.basePath
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

