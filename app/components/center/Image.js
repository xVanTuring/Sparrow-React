import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { selectImage } from '../../actions/image';

// TODO: set selectedImg when drag(down)
// fix landscape img border
export const ImageModel = 'Image';
type ImageProp = {
  id?: string,
  onImageClick: (id: string) => void,
  width?: number,
  size?: string,
  src: string,
  name: string,
  connectDragSource: any,
  connectDragPreview: any,
  selectedImgs: List<string>,
  hoveredImgs: string[]
};
class Image extends Component<ImageProp> {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.imgRef = null;
  }
  handleClick = () => {
    console.log('Click');
    this.props.onImageClick([this.id]);
  }
  handleMouseDown = (e) => {
    e.stopPropagation();
  }
  render() {
    const { connectDragSource, selectedImgs, hoveredImgs } = this.props;
    let selected = false;
    if (selectedImgs != null) {
      selectedImgs.forEach((value) => {
        if (value === this.props.id) {
          selected = true;
        }
      });
    }
    if (hoveredImgs != null) {
      hoveredImgs.forEach((value) => {
        if (value === this.props.id) {
          selected = true;
        }
      });
    }
    return connectDragSource((
      <div
        style={{
          margin: '8px',
          pointerEvents: 'auto'
        }}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
      >
        <div
          style={{
            padding: '2px',
            border: `2px solid ${selected ? '#0E70E8' : 'rgba(0,0,0,0)'}`,
            borderRadius: '4px',
            marginBottom: 8,
            pointerEvents: 'none',
            width: this.props.width || 200,
          }}
        >
          <img
            src={this.props.src}
            style={{
              width: this.props.width || 200,
              verticalAlign: 'bottom',
              borderRadius: '2px',
              // display: 'block'
            }}
            alt="img"
          // ref={(e) => { this.props.connectDragPreview(e); }}
          />
        </div>
        <div
          style={{
            width: this.props.width || 200,
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 16,
              padding: '2px 6px',
              borderRadius: 4,
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              // backgroundColor: 'blue'
            }}
          >{this.props.name}
          </span>
          <br />
          <span
            style={{
              color: '#686868',
              fontSize: 10,
            }}
          >
            {this.props.size}
          </span>
        </div>
      </div>));
  }
}

const mapStateToProps = (state) => {
  return {
    selectedImgs: state.selectedImgs
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onImageClick: (id) => {
      dispatch(selectImage(id));
    }
  };
};
const imageSource = {
  beginDrag(props, monitor, component) {
    // console.log(component);
    return { id: '123' };
  }
};
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}
const DragImage = DragSource(ImageModel, imageSource, collect)(Image);
export default connect(mapStateToProps, mapDispatchToProps)(DragImage);
