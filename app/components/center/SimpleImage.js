import React, { Component } from 'react';
// import LazyLoad from 'react-lazyload';
type SimpleImageProps = {
  imgPath: string,
  width: number,
  height: number
};
class SimpleImage extends Component<SimpleImageProps> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.imgPath !== this.props.imgPath
      || nextProps.width !== this.props.width) {
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
          width: this.props.width,
          height: this.props.height,
          verticalAlign: 'bottom',
          borderRadius: '2px',
        }}
        alt="img"
      />
    );
  }
}
export default SimpleImage;

