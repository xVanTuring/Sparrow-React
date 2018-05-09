import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import { selectImage } from '../../actions/image';

type ImageProp = {
  img_id: string,
  onImageClick: (id: string) => void,
  width: number,
  src: string
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
    return (
      <div
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
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('');
  return {
    select_image_id: state.images.get('select_image_id')
  };
};
const mapDispatchToProps = (dispatch) => {
  console.log('');
  return {
    onImageClick: (id) => {
      dispatch(selectImage(id));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Image);
