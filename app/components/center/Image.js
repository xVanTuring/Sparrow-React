import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { selectImage } from '../../actions/image';

export type ImageType = {
  name: string,
  size: string,
  src: string
};
export const ImageModel = 'Image';
type ImageProp = {
  id?: string,
  onImageClick: (id: string) => void,
  width?: number,
  size?: string,
  src: string,
  name: string,
  connectDragSource: any,
  connectDragPreview: any

};
class Image extends Component<ImageProp> {
  constructor(props) {
    super(props);
    this.id = this.props.id || uuidv1();
  }
  handleClick = (e) => {
    this.props.onImageClick(this.id);
    // e.stopPropagation();
  }
  handleMouseDown = (e) => {
    e.stopPropagation();
  }
  render() {
    // add support for multi-select
    const { connectDragSource } = this.props;
    return connectDragSource(<div
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
          border: '2px solid ' + ((this.id === this.props.select_image_id) ? '#0E70E8' : 'rgba(0,0,0,0)'),
          borderRadius: '4px',
          marginBottom: 8,
          pointerEvents: 'none'
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
          ref={(e) => { this.props.connectDragPreview(e); }}
        />
      </div>
      <div
        style={{
          color: 'white',
          fontSize: 16,
          padding: '2px 6px',
          // backgroundColor: 'blue',
          borderRadius: 4,
          textAlign: 'center',
        }}
      >{this.props.name}
      </div>
      <span
        style={{
          color: '#686868',
          fontSize: 10,
          // verticalAlign: 'top',
        }}
      >
        {this.props.size}
      </span>
    </div>);
  }
}

const mapStateToProps = (state) => {
  // console.log('');
  return {
    select_image_id: state.selectedImg
  };
};
const mapDispatchToProps = (dispatch) => {
  // console.log('');
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
