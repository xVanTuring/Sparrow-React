import React, { Component } from 'react';
import { List } from 'immutable';
import Masonry from 'react-masonry-component';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import Image from './Image';
import DropArea from './DropArea';
import { selectImage } from '../../actions/image';
// TODO: move ALL EVENT TO document and use state to tell actions.

type Prop = {
  images: List | [],
  connectDropTarget: any,
  isOver: boolean,
  // isOverCurrent: boolean,
  canDrop: boolean,
  basePath: string,
  setSelected: (ids: []) => void
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
      hoveredImgs: []
    };
    this.scroller = null;
    this.masonry = null;
    this.initScrollTop = 0;
  }
  handleHover = (newOffset) => {
    const imgPos = this.masonry.items.map(item => {
      return convertPos(item, this.masonry.size.marginLeft, 0);
    });
    const { currentMousePos, startMousePos, hoveredImgs } = this.state;
    let { offset } = this.state;
    offset = newOffset || offset;
    const updatedY = currentMousePos.y + offset;
    const height = Math.abs(startMousePos.y - updatedY);
    const width = Math.abs(startMousePos.x - currentMousePos.x);
    const left = (startMousePos.x < currentMousePos.x ?
      startMousePos.x : currentMousePos.x) - 230;
    const top = (startMousePos.y < updatedY ?
      startMousePos.y : updatedY) - 32;
    const selectionRect = {
      x: left,
      y: top,
      width,
      height
    };
    // TODO: use last index to reduce calcu.
    const interArr: [] = imgPos.map(item => {
      return isIntersect(selectionRect, item);
    });
    const newHoveredImgs = [];
    interArr.forEach((value, index) => {
      if (value) {
        newHoveredImgs.push(this.props.images.get(index).id);
      }
    });
    let diff = false;
    if (hoveredImgs.length === newHoveredImgs.length) {
      for (let i = 0; i < hoveredImgs.length; i += 1) {
        if (hoveredImgs[i] !== newHoveredImgs[i]) {
          diff = true;
        }
      }
    } else {
      diff = true;
    }
    if (diff) {
      this.setState({
        hoveredImgs: newHoveredImgs
      });
    }
  }
  handleMouseDown = (e) => {
    const top = this.scroller.scrollTop;
    this.setState({
      isDragging: true,
      startMousePos: { x: e.clientX, y: e.clientY + top },
      currentMousePos: { x: e.clientX, y: e.clientY + top },
    });
    this.initScrollTop = top;
    this.props.setSelected([]);
  }
  handleMouseMove = (e) => {
    if (this.state.isDragging) {
      this.setState({
        currentMousePos: { x: e.clientX, y: e.clientY + this.initScrollTop },
      });
      // console.log(this.masonry.size.marginLeft)
      this.handleHover();
      // this.props.setSelected(selectedItem);
    }
  }
  handleMouseUp = () => {
    if (this.state.isDragging) {
      this.props.setSelected(this.state.hoveredImgs);
      this.setState({
        isDragging: false,
        startMousePos: { x: 200, y: 32 },
        currentMousePos: { x: 200, y: 32 },
        offset: 0,
        hoveredImgs: []
      });
    }
  }
  handleSroll = () => {
    const offset = this.scroller.scrollTop - this.initScrollTop;
    if (this.state.isDragging) {
      this.setState({
        offset
      });
      this.handleHover(offset);
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

    const updatedY = currentMousePos.y + offset;
    const height = isDragging ? Math.abs(startMousePos.y - updatedY) : 0;
    const width = isDragging ? Math.abs(startMousePos.x - currentMousePos.x) : 0;
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
        onMouseLeave={this.handleMouseUp}
        onScroll={this.handleSroll}
        ref={(ref) => { this.scroller = ref; }}
      >
        <Masonry
          ref={(ref) => {
            this.masonry = this.masonry || ref.masonry;
          }}
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
                id={item.id}
                hoveredImgs={this.state.hoveredImgs}
              />);
            })
          }
        </Masonry>
        <div
          style={{
            position: 'absolute',
            left: left - 230,
            top: top - 32,
            width,
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
const convertPos = (item, marMarginL, marMarginT) => {
  return {
    width: item.size.width,
    height: item.size.height,
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
export const PRESET_FOLDER_ID = ['ALL', 'UNCAT', 'UNTAG', 'TRASH'];
const filter = (imgs: List, folderId) => {
  switch (folderId) {
    case 'ALL':
      return imgs.filter((item) => {
        return !item.isDeleted;
      });
    case 'TRASH':
      return imgs.filter((item) => {
        return item.isDeleted;
      });
    case '':
      return [];
    default:
      return imgs.filter((item) => {
        if (item.isDeleted) {
          return false;
        }
        if (item.folders.length > 0) {
          let inFolder = false;
          item.folders.forEach(id => {
            if (id === folderId) {
              inFolder = true;
            }
          });
          return inFolder;
        }
        return false;
      });
  }
};
const mapStateToProps = (state) => {
  return {
    images: filter(state.images, state.selectFolder),
    basePath: state.basePath
    // with filter
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSelected: (ids) => {
      dispatch(selectImage(ids));
    }
  };
};

const centerTarget = {
  drop(props, monitor) {

  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    // isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  };
}
const DropCenter = DropTarget([NativeTypes.FILE], centerTarget, collect)(Center);
export default connect(mapStateToProps, mapDispatchToProps)(DropCenter);

