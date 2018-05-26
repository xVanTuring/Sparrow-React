import React, { Component } from 'react';

type SimpleImageProps = {
  imgPath: string
};
class SimpleImage extends Component<SimpleImageProps> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.imgPath !== this.props.imgPath) {
      console.log('SimpleImage Update');
      return true;
    }
    return false;
  }
  render() {
    return (
      <img
        src={this.props.imgPath}
        style={{
          width: '100%',
          height: '100%',
          verticalAlign: 'bottom',
          borderRadius: '2px',
        }}
        alt="img"
      />
    );
  }
}
export default SimpleImage;

