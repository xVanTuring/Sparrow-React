import React, { Component } from 'react';
import { List } from 'immutable';
import settings from 'electron-settings';
// import _ from 'lodash';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { selectImage } from '../../actions/image';
import { ImageType } from '../../types/app';
import SimpleImage from './SimpleImage';

export const ImageModel = 'Image';
type ImageProp = {
  selectImage: (id: string[]) => void,
  onImageDoubleClick: (id: string) => void,
  connectDragSource: any,
  // connectDragPreview: any,
  selectedImgs: List<string>,
  displayImages: List<ImageType>,
  image: ImageType,
  imageHeight: number
};
class Image extends Component<ImageProp> {
  constructor(props) {
    super(props);
    this.regionSelection = false;
  }
  shouldComponentUpdate(nextProp) {
    // if (nextProp.imageHeight !== this.props.imageHeight) {
    //   if (nextProp.imageHeight < 200 * 0.6 && this.props.imageHeight > 200 * 0.6) {
    //     return true;
    //   }
    //   if (nextProp.imageHeight > 200 * 0.6 && this.props.imageHeight < 200 * 0.6) {
    //     return true;
    //   }
    // }
    if (nextProp.selectedImgs !== this.props.selectedImgs) {
      if (this.props.selectedImgs.indexOf(this.props.image.id) === -1
        && nextProp.selectedImgs.indexOf(nextProp.image.id) === -1) {
        return false;
      }
      if (this.props.selectedImgs.indexOf(this.props.image.id) !== -1
        && nextProp.selectedImgs.indexOf(nextProp.image.id) !== -1) {
        return false;
      }
      return true;
    }
    return false;
  }
  handleClick = () => {
    if (!this.regionSelection) {
      if (this.props.selectedImgs.size === 0 || this.props.selectedImgs.size > 1) {
        this.props.selectImage([this.props.image.id]);
      } else if (this.props.selectedImgs.get(0) !== this.props.image.id) {
        this.props.selectImage([this.props.image.id]);
      }
    }
    this.regionSelection = false;
  }
  handleDoubleClick = () => {
    const { onImageDoubleClick } = this.props;
    if (onImageDoubleClick) {
      onImageDoubleClick(this.props.image.id);
    }
  }
  handleContextMenu = (e) => {
    e.preventDefault();
  }
  handleMouseDown = (e) => {
    e.stopPropagation();
    if (e.shiftKey) {
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
      if (selectedImgs.indexOf(this.props.image.id) === -1) {
        selectedImgIndexes.push(displayImagesId.indexOf(this.props.image.id));
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
        endIndex = displayImagesId.indexOf(this.props.image.id);
        if (startIndex > endIndex) {
          startIndex = endIndex;
          [endIndex] = selectedImgIndexes;
        }
      }
      const newSelection = displayImagesId.slice(startIndex, endIndex + 1);

      this.props.selectImage(newSelection);
    } else if (e.ctrlKey) {
      this.regionSelection = true;
      const {
        selectedImgs,
        image
      } = this.props;
      const { id } = image;
      if (selectedImgs.indexOf(id) === -1) {
        const newSelected = selectedImgs.push(id);
        this.props.selectImage(newSelected);
      } else {
        const newSelected = selectedImgs.splice(selectedImgs.indexOf(id), 1);
        this.props.selectImage(newSelected);
      }
    } else if (!this.isSelected()) {
      this.regionSelection = false;
      this.props.selectImage([this.props.image.id]);
    }
  }
  isSelected = () => {
    const { selectedImgs } = this.props;
    return selectedImgs.indexOf(this.props.image.id) !== -1;
  }
  render() {
    const {
      connectDragSource,
      image,
      // imageHeight
    } = this.props;

    const selected = this.isSelected();
    return (
      <div
      >
        {
          connectDragSource((
            <div
              style={{
                padding: 3,
                boxSizing: 'border-box',
                border: `2px solid ${selected ? '#0E70E8' : 'rgba(0,0,0,0)'}`,
                borderRadius: '4px',
                WebkitTransition: 'border-color .15s ease',
              }}
              onClick={this.handleClick}
              onMouseDown={this.handleMouseDown}
            // onContextMenu={this.handleContextMenu}
            >
              <SimpleImage
                imgPath={`${settings.get('rootDir')}/images/${image.id}/${image.name}_thumb.png`}
              />
            </div>
          ))
        }
        <div
          style={{
            marginTop: 4,
            pointerEvents: 'none',
            height: 28,
            width: '100%',
            textAlign: 'center',
            paddingLeft: 4,
            paddingRight: 4,
            display: 'none'
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 12,
              padding: '0 2px',
              borderRadius: 4,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              wordBreak: 'break-word',
              height: 16,
              lineHeight: '16px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {this.props.image.name || '233'}
          </div>
          <span
            style={{
              color: '#686868',
              fontSize: 10,
              textAlign: 'right'
            }}
          >
            {`${this.props.image.width} x ${this.props.image.height}`}
          </span>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    selectedImgs: state.selectedImgs,
    imageHeight: state.imageHeight
  });
const mapDispatchToProps = (dispatch) => {
  return {
    selectImage: (id: string[]) => {
      dispatch(selectImage(id));
    }
  };
};
const imageSource = {
  beginDrag(props) {
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
