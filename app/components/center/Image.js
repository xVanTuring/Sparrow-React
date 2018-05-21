import React, { Component } from 'react';
import { List } from 'immutable';
import _ from 'lodash';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { selectImage } from '../../actions/image';
import { ImageType } from '../../types/app';

// TODO: set selectedImg when drag(down)
// fix landscape img border
export const ImageModel = 'Image';
type ImageProp = {
  id?: string,
  onImageClick: (id: string) => void,
  onImageDoubleClick: (id: string) => void,
  width?: number,
  size?: string,
  src: string,
  name: string,
  connectDragSource: any,
  // connectDragPreview: any,
  selectedImgs: List<string>,
  hoveredImgs: string[],

  displayImages: List<ImageType>
};
class Image extends Component<ImageProp> {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.imgRef = null;
    this.regionSelection = false;
  }
  handleClick = () => {
    if (!this.regionSelection) {
      this.props.onImageClick([this.id]);
    }

    this.regionSelection = false;
  }
  handleDoubleClick = () => {
    const { onImageDoubleClick } = this.props;
    if (onImageDoubleClick) {
      onImageDoubleClick(this.props.id);
    }
  }
  handleContextMenu = (e) => {
    e.preventDefault();
  }
  handleMouseDown = (e) => {
    e.stopPropagation();
    if (e.shiftKey) {
      // lose the first selectedKey
      this.regionSelection = true;
      const {
        displayImages,
        selectedImgs
      } = this.props;
      let startIndex = Infinity;
      let endIndex = Infinity;
      let selectedImgIndexes = [];
      const displayImagesId = displayImages.map((item) => {
        return item.id;
      }).toArray();
      selectedImgs.forEach(item => {
        selectedImgIndexes.push(displayImagesId.indexOf(item));
      });
      if (selectedImgs.indexOf(this.props.id) === -1) {
        selectedImgIndexes.push(displayImagesId.indexOf(this.props.id));
        selectedImgIndexes = selectedImgIndexes.sort((a, b) => {
          return a - b;
        });
        [startIndex] = selectedImgIndexes;
        endIndex = selectedImgIndexes[selectedImgIndexes.length - 1];
      } else {
        // maybe not ness
        selectedImgIndexes = selectedImgIndexes.sort((a, b) => {
          return a - b;
        });
        [startIndex] = selectedImgIndexes;
        endIndex = displayImagesId.indexOf(this.props.id);
        if (startIndex > endIndex) {
          startIndex = endIndex;
          [endIndex] = selectedImgIndexes;
        }
      }
      const newSelection = displayImagesId.slice(startIndex, endIndex + 1);

      this.props.onImageClick(newSelection);
    } else if (e.ctrlKey) {
      this.regionSelection = true;
      const {
        selectedImgs,
        id
      } = this.props;
      if (selectedImgs.indexOf(id) === -1) {
        const newSelected = selectedImgs.push(id);
        this.props.onImageClick(newSelected);
      } else {
        const newSelected = selectedImgs.splice(selectedImgs.indexOf(id), 1);
        this.props.onImageClick(newSelected);
      }
    } else if (!this.isSelected()) {
      this.regionSelection = false;
      this.props.onImageClick([this.id]);
    }
  }
  isSelected = () => {
    const { selectedImgs } = this.props;
    let selected = false;
    if (selectedImgs != null) {
      selectedImgs.forEach((value) => {
        if (value === this.props.id) {
          selected = true;
        }
      });
    }
    return selected;
  }
  render() {
    const { connectDragSource, hoveredImgs } = this.props;
    let selected = this.isSelected();
    if (hoveredImgs != null) {
      hoveredImgs.forEach((value) => {
        if (value === this.props.id) {
          selected = true;
        }
      });
    }
    return connectDragSource((
      <div
        className="Image"
        style={{
          margin: '8px',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            padding: '2px',
            border: `2px solid ${selected ? '#0E70E8' : 'rgba(0,0,0,0)'}`,
            borderRadius: '4px',
            marginBottom: 8
          }}
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onContextMenu={this.handleContextMenu}
        >
          <img
            src={this.props.src}
            style={{
              width: this.props.width || 200,
              verticalAlign: 'bottom',
              borderRadius: '2px',
            }}
            alt="img"
            onDoubleClick={this.handleDoubleClick}
          />
        </div>
        <div
          style={{
            width: this.props.width || 200,
            pointerEvents: 'none'
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
              textAlign: 'right'
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
    selectedImgs: state.selectedImgs,
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
  beginDrag(props, monitor) {
    return { images: props.selectedImgs.toArray() };
  }
};
function collect(_connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: _connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    // connectDragPreview: _connect.dragPreview(),
  };
}
const DragImage = DragSource(ImageModel, imageSource, collect)(Image);
export default connect(mapStateToProps, mapDispatchToProps)(DragImage);
