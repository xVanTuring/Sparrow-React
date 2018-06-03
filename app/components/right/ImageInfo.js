import React, { Component } from 'react';

type ImageInfoProps = {
  name: string,
  value: string
};
class ImageInfo extends Component<ImageInfoProps> {
  render() {
    return (
      <div
        style={{
          color: 'white'
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: '#ddd'
          }}
        >
          {
            `${this.props.name}:`
          }
        </span>
        <span
          style={{
            float: 'right',
            fontSize: 12
          }}
        >
          {
            `${this.props.value}`
          }
        </span>
      </div>
    );
  }
}
export default ImageInfo;
