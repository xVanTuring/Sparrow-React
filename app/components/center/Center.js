import React, { Component } from 'react';
import { List } from 'immutable';
import { Slider } from 'antd';
import settings from 'electron-settings';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import DropArea from './DropArea';
import { selectImage } from '../../actions/image';
import { ImageType } from '../../types/app';
import BigPicture from './BigPicture';
import Gallery from './Gallery';
import arrDiff, { listDiff } from '../utils';
import TopController from './TopController';
// TODO: move ALL EVENT TO document and use state to tell actions.
// TODO: add folder in gallery
// separate the gallery to a component
type Prop = {
  images: List<ImageType>,
  connectDropTarget: any,
  isOver: boolean,
  // canDrop: boolean,
  selectedFolder: string,
  setSelected: (ids: []) => void,
  selectedImgs: List<string>
};
class Center extends Component<Prop> {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      startMousePos: { x: 0, y: 0 },
      currentMousePos: { x: 0, y: 0 },
      offset: 0,
      viewImageId: '',
      scrollTop: 0
    };
    this.scroller = null;
    // this.masonry = null;
    this.initScrollTop = 0;
  }
  componentWillReceiveProps(nextProp: Prop) {
    if (nextProp.selectedFolder !== this.props.selectedFolder && this.state.viewImageId !== '') {
      // folder updated
      this.setState({
        viewImageId: nextProp.images.size > 0 ? nextProp.images.get(0).id : ''
      });
    }
  }
  shouldComponentUpdate(nextProp, nextState) {
    if (nextProp.selectedImgs !== this.props.selectedImgs) {
      return true;
    }
    if (this.props.isOver !== nextProp.isOver) {
      return true;
    }
    if (
      nextState.offset !== this.state.offset
      || nextState.isDragging !== this.state.isDragging
      || nextState.startMousePos.y !== this.state.startMousePos.y
      || nextState.startMousePos.x !== this.state.startMousePos.x
      || nextState.currentMousePos.x !== this.state.currentMousePos.x
      || nextState.currentMousePos.y !== this.state.currentMousePos.y
      || nextState.scrollTop !== this.state.scrollTop
    ) {
      return true;
    }
    if (listDiff(this.props.images, nextProp.images)) {
      return true;
    }
    return false;
  }
  handleHover = (newOffset) => {
    const imgPos = this.masonry.items.map(item => (
      convertPos(item, this.masonry.element.offsetLeft, 0)
    ));
    const { currentMousePos, startMousePos } = this.state;
    const { selectedImgs } = this.props;
    let { offset } = this.state;
    offset = newOffset || offset;
    const updatedY = currentMousePos.y + offset;
    const height = Math.abs(startMousePos.y - updatedY);
    const width = Math.abs(startMousePos.x - currentMousePos.x);
    const left = (startMousePos.x < currentMousePos.x ?
      startMousePos.x : currentMousePos.x) - 200;
    const top = (startMousePos.y < updatedY ?
      startMousePos.y : updatedY) - 32;
    const selectionRect = {
      x: left,
      y: top,
      width,
      height
    };
    const interArr: [] = imgPos.map(item => (isIntersect(selectionRect, item)));
    const newHoveredImgs = [];
    interArr.forEach((value, index) => {
      if (value) {
        newHoveredImgs.push(this.props.images.get(index).id);
      }
    });
    const diff = arrDiff(selectedImgs.toArray(), newHoveredImgs);
    if (diff) {
      this.props.setSelected(newHoveredImgs);
    }
  }
  handleMouseDown = (e) => {
    // const top = this.scroller.scrollTop;
    // this.setState({
    //   isDragging: true,
    //   startMousePos: { x: e.clientX, y: e.clientY + top },
    //   currentMousePos: { x: e.clientX, y: e.clientY + top },
    // });
    // this.initScrollTop = top;
    // if (this.props.selectedImgs.size !== 0) {
    //   this.props.setSelected([]);
    // }
  }
  handleMouseMove = (e) => {
    if (this.state.isDragging) {
      this.setState({
        currentMousePos: { x: e.clientX, y: e.clientY + this.initScrollTop },
      }, () => {
        this.handleHover();
      });
    }
  }
  handleMouseUp = () => {
    if (this.state.isDragging) {
      this.setState({
        isDragging: false,
        startMousePos: { x: 0, y: 0 }, // startMousePos: { x: 200, y: 32 },
        currentMousePos: { x: 0, y: 0 },
        offset: 0,
      });
    }
  }
  handleSroll = () => {
    // if (this.state.isDragging) {
    //   const offset = this.scroller.scrollTop - this.initScrollTop;
    //   this.setState({
    //     offset
    //   }, () => {
    //     this.handleHover();
    //   });
    // }
  }
  handleImageDoubleClick = (id: string) => {
    this.setState({
      viewImageId: id
    });
  }
  setScrollTop = (value) => {
    if (this.scroller) {
      this.scroller.scrollTop = value;
    }
  }
  render() {
    const { connectDropTarget, isOver } = this.props;
    const {
      isDragging,
      startMousePos,
      currentMousePos,
      offset
    } = this.state;
    const filterOpen = false;
    const updatedY = currentMousePos.y + offset;
    const height = isDragging ? Math.abs(startMousePos.y - updatedY) : 0;
    const width = isDragging ? Math.abs(startMousePos.x - currentMousePos.x) : 0;
    const left = startMousePos.x < currentMousePos.x ?
      startMousePos.x : currentMousePos.x;
    const top = startMousePos.y < updatedY ?
      startMousePos.y : updatedY;
    return connectDropTarget((
      <div
        className="right_border"
        style={{
          position: 'absolute',
          backgroundColor: '#535353',
          left: 200,
          right: 230,
          top: 0,
          bottom: 0,
        }}
      >
        <TopController />
        <div
          className="container"
          style={{
            position: 'absolute',
            top: 32,
            bottom: 0,
            right: filterOpen ? 200 : 0,
            left: 0,
            backgroundColor: '#303030',
            overflow: 'auto',
            overflowX: 'hidden',
            display: this.state.viewImageId === '' ? '' : 'none'
          }}
          // onMouseDown={this.handleMouseDown}
          // onMouseMove={this.handleMouseMove}
          // onMouseUp={this.handleMouseUp}
          // onMouseLeave={this.handleMouseUp}
          onScroll={this.handleSroll}
          ref={(ref) => { this.scroller = ref; }}
        >
          <Gallery
            onImageDoubleClick={this.handleImageDoubleClick}
          />
          <div
            className="drag-area"
            style={{
              position: 'absolute',
              left: left - 200,
              top: top - 32,
              width,
              height,
              backgroundColor: `rgba(58,201,223,${isDragging ? '0.43' : '0'})`,
              border: '1px solid',
              borderColor: `rgba(58,201,223,${isDragging ? '0.7' : '0'})`,
              pointerEvents: 'none',
              boxSizing: 'border-box',
              WebkitTransition: 'background-color .1s  ,border-color .3s',
            }}
          />

        </div>
        <div
          className="drop_mask"
          style={{
            position: 'absolute',
            top: 32,
            left: 0,
            right: filterOpen ? 200 : 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: isOver ? '' : 'none'
          }}
        >
          <DropArea />
        </div>
      </div >
    ));
  }
}
const convertPos = (item, marMarginL, marMarginT) => {
  return {
    width: item.size.width,
    height: item.element.childNodes[0].offsetHeight,
    x: item.position.x + marMarginL + 8,
    y: item.position.y + marMarginT + 8
  };
};
const isIntersect = (item1, item2) => {
  const minx1 = item1.x;
  const minx2 = item2.x;
  const maxx1 = minx1 + item1.width;
  const maxx2 = minx2 + item2.width;

  const miny1 = item1.y;
  const miny2 = item2.y;
  const maxy1 = miny1 + item1.height;
  const maxy2 = miny2 + item2.height;

  const minX = Math.max(minx1, minx2);
  const minY = Math.max(miny1, miny2);

  const maxX = Math.min(maxx1, maxx2);
  const maxY = Math.min(maxy1, maxy2);
  if (minX > maxX || minY > maxY) {
    return false;
  }
  return true;
};
export const PRESET_FOLDER_ID = ['--ALL--', '--UNCAT--', '--UNTAG--', '--TRASH--'];
export const filter = (imgs: List, folderId) => {
  switch (folderId) {
    case PRESET_FOLDER_ID[0]:
      return imgs.filter((item) => (!item.isDeleted));
    case PRESET_FOLDER_ID[3]:
      return imgs.filter((item) => (item.isDeleted));
    case '':
      return List([]);
    default:
      return imgs.filter((item) => {
        if (item.isDeleted) {
          return false;
        }
        if (item.folders.length > 0) {
          for (let index = 0; index < item.folders.length; index += 1) {
            const id = item.folders[index];
            if (id === folderId) {
              return true;
            }
          }
          return false;
        }
        return false;
      });
  }
};
const mapStateToProps = (state) => (
  {
    images: filter(state.images, state.selectedFolder),
    selectedFolder: state.selectedFolder,
    selectedImgs: state.selectedImgs,
  }
);
const mapDispatchToProps = (dispatch) => (
  {
    setSelected: (ids) => {
      dispatch(selectImage(ids));
    }
  }
);
const centerTarget = {
  drop(props, monitor) {

  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    // canDrop: monitor.canDrop(),
  };
}
const DropCenter = DropTarget([NativeTypes.FILE, NativeTypes.URL], centerTarget, collect)(Center);
export default connect(mapStateToProps, mapDispatchToProps)(DropCenter);

