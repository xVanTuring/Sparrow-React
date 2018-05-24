import React, { Component } from 'react';

type SimpleImageProps = {
  imgPath: string,
  width: number
};
class SimpleImage extends Component<SimpleImageProps> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.imgPath !== this.props.imgPath || nextProps.width !== this.props.width) {
      // console.log('Updated');
      return true;
    }
    // console.log('Not Updated');
    return false;
  }
  render() {
    return (
      <img
        src={this.props.imgPath}
        style={{
          width: this.props.width || 200,
          verticalAlign: 'bottom',
          borderRadius: '2px',
        }}
        alt="img"
      />
    );
  }
}
export default SimpleImage;
