import React, { Component } from 'react';
import settings from 'electron-settings';
import { List } from 'immutable';
import Masonry from 'react-masonry-component';
import Image from './Image';
import { listDiff } from '../utils';
// TODO: use React Virtualized or other to opti the list

type GalleryProps = {
  images: List,
  onRef: (ref) => void,
  onImageDoubleClick: () => void
};
class Gallery extends Component<GalleryProps> {
  shouldComponentUpdate(nextProp) {
    if (listDiff(nextProp.images, this.props.images)) {
      console.log('gallery update 1');
      return true;
    }
    return false;
  }

  render() {
    return (
      <Masonry
        ref={(ref) => {
          if (ref) {
            this.props.onRef(ref.masonry);
          }
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
            displayImages={this.props.images}
            onImageDoubleClick={this.props.onImageDoubleClick}
          />))
        }
      </Masonry>
    );
  }
}

export default Gallery;
