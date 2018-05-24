import React, { Component } from 'react';
import settings from 'electron-settings';
import { List } from 'immutable';
import Masonry from 'react-masonry-component';
import Image from './Image';
import arrDiff from '../utils';


type GalleryProps = {
  images: List,
  onRef: (ref) => void,
  onImageDoubleClick: () => void,
  hoveredImgs: []
};
class Gallery extends Component<GalleryProps> {
  shouldComponentUpdate(nextProp) {
    if (arrDiff(this.props.hoveredImgs, nextProp.hoveredImgs)) {
      return true;
    }
    if (nextProp.images === this.props.images) {
      return false;
    }
    return true;
  }
  render() {
    console.log('render');
    return (
      <Masonry
        ref={(ref) => {
          this.props.onRef(ref);
        }}
        style={{
          margin: 'auto',
        }}
        options={{
          fitWidth: true,
        }}

      >
        {
          this.props.images.map((item) => (<Image
            src={`${settings.get('rootDir')}/images/${item.id}/${item.name}_thumb.png`}
            key={item.id}
            size={`${item.width}x${item.height}`}
            name={item.name}
            id={item.id}
            hoveredImgs={this.props.hoveredImgs}
            displayImages={this.props.images}
            onImageDoubleClick={this.props.onImageDoubleClick}
          />))
        }
      </Masonry>
    );
  }
}
export default Gallery;
