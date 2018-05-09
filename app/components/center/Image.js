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
  img_id?: string,
  onImageClick: (id: string) => void,
  width?: number,
  src: string,
  connectDragSource: any,
  connectDragPreview: any
  // isDragging?: boolean

};
class Image extends Component<ImageProp> {
  constructor(props) {
    super(props);
    this.img_id = this.props.img_id || uuidv1();
  }
  handleClick = () => {
    this.props.onImageClick(this.img_id);
  }
  render() {
    // add support for multi-select
    const { connectDragSource } = this.props;
    return connectDragSource(<div
      onClick={this.handleClick}
      style={{
        margin: '8px',
        padding: '2px',
        border: '2px solid ' + ((this.img_id === this.props.select_image_id) ? '#0E70E8' : 'rgba(0,0,0,0)'),
        borderRadius: '4px',
      }}
    >
      <img
        src={this.props.src}
        style={{
          width: this.props.width || 200,
          verticalAlign: 'bottom',
          borderRadius: '2px'
        }}
        alt="img"
        ref={(e) => { this.props.connectDragPreview(e) }}
      />
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
    console.log(component);
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
