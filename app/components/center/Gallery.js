import React, { Component } from 'react';
import settings from 'electron-settings';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Masonry from 'react-masonry-component';
import Image from './Image';
import { listDiff } from '../utils';
import { PRESET_FOLDER_ID } from './Center';
import { ImageType } from '../../types/app';
import LazyLoad from 'react-lazy-load';
// TODO: use lazy-load or other to opti the list

type GalleryProps = {
  images: List<ImageType>,
  onRef: (ref) => void,
  onImageDoubleClick: () => void,
  selectedFolder: string
};
class Gallery extends Component<GalleryProps> {
  shouldComponentUpdate(nextProp) {
    if (nextProp.images !== this.props.images) {
      return true;
    }
    if (this.props.selectedFolder !== nextProp.selectedFolder) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {
          filter(this.props.images, this.props.selectedFolder)
            .map((item) => (
              <Image
                key={item.id}
                displayImages={this.props.images}
                onImageDoubleClick={this.props.onImageDoubleClick}
                image={item}
              />
            ))
        }
      </div>);
  }
}
const filter = (imgs: List, folderId) => {
  switch (folderId) {
    case PRESET_FOLDER_ID[0]:
      return imgs.filter((item) => (!item.isDeleted)).toList();
    case PRESET_FOLDER_ID[3]:
      return imgs.filter((item) => (item.isDeleted)).toList();
    case '':
      return List([]);
    default:
      return imgs.filter((item) => {
        if (item.isDeleted) {
          return false;
        }
        if (item.folders.length > 0) {
          for (let index = 0; index < item.folders.length; index += 1) {
            const id = item.folders[index];
            if (id === folderId) {
              return true;
            }
          }
          return false;
        }
        return false;
      }).toList();
  }
};
const mapStateToProps = (state) => (
  {
    images: state.images,
    selectedFolder: state.selectedFolder,
  }
);
export default connect(mapStateToProps)(Gallery);
