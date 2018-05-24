import React, { Component } from 'react';
import settings from 'electron-settings';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Masonry from 'react-masonry-component';
import Image from './Image';
import { listDiff } from '../utils';
import { PRESET_FOLDER_ID } from './Center';
// TODO: use lazy-load or other to opti the list

type GalleryProps = {
  images: List,
  onRef: (ref) => void,
  onImageDoubleClick: () => void,
  selectedFolder: string
};
class Gallery extends Component<GalleryProps> {
  constructor(props) {
    super(props);
    this.foldersViews = {};
    this.updatedMap = true;
  }
  shouldComponentUpdate(nextProp) {
    if (listDiff(nextProp.images, this.props.images)) {
      this.updatedMap = true;
      return true;
    }
    if (this.props.selectedFolder !== nextProp.selectedFolder) {
      return true;
    }
    return false;
  }
  generate = () => {
    const views = filter(this.props.images, this.props.selectedFolder)
      .map((item) => (
        <Image
          src={`${settings.get('rootDir')}/images/${item.id}/${item.name}_thumb.png`}
          key={item.id}
          size={`${item.width}x${item.height}`}
          name={item.name}
          id={item.id}
          displayImages={this.props.images}
          onImageDoubleClick={this.props.onImageDoubleClick}
          image={item}
        />
      ));
    this.foldersViews[this.props.selectedFolder] = views;
    return views;
  }

  render() {
    let views = this.foldersViews[this.props.selectedFolder];
    if (this.updatedMap || views == null) {
      views = this.generate();
      this.updatedMap = false;
    }
    return (
      <Masonry
        key={Date.now()} // ???????????????????????????????????
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
          views
        }
      </Masonry>
    );
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
