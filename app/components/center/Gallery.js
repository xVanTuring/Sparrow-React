import React, { Component } from 'react';
import settings from 'electron-settings';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Masonry from 'react-masonry-component';
import Image from './Image';
import { listDiff } from '../utils';
import { PRESET_FOLDER_ID } from './Center';
import { ImageType } from '../../types/app';
// TODO: use lazy-load or other to opti the list

type GalleryProps = {
  images: List<ImageType>,
  onRef: (ref) => void,
  onImageDoubleClick: () => void,
  selectedFolder: string
};
class Gallery extends Component<GalleryProps> {
  constructor(props) {
    super(props);
    this.foldersViews = {};
    this.updatedMap = true;
    this.updateAll();
  }
  shouldComponentUpdate(nextProp) {
    if (nextProp.images !== this.props.images) {
      this.updatedMap = true;
      return true;
    }
    if (this.props.selectedFolder !== nextProp.selectedFolder) {
      return true;
    }
    return false;
  }

  generate = (id) => {
    const views = filter(this.props.images, id || this.props.selectedFolder)
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
  updateAll = () => {
    const imageMap = {};
    imageMap[PRESET_FOLDER_ID[0]] = [];
    imageMap[PRESET_FOLDER_ID[3]] = [];
    this.props.images.forEach((image) => {
      if (image.isDeleted) {
        imageMap[PRESET_FOLDER_ID[3]].push(image);
      } else {
        imageMap[PRESET_FOLDER_ID[0]].push(image);
        image.folders.forEach((item) => {
          if (imageMap[item]) {
            imageMap[item].push(image);
          } else {
            imageMap[item] = [image];
          }
        });
      }
    });
    const folders = Object.keys(imageMap);
    folders.forEach(folderId => {
      const imagesInFolder = imageMap[folderId];
      this.foldersViews[folderId] = imagesInFolder.map(item => (
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
    });
  }

  render() {
    if (this.updatedMap) {
      console.log('Update Map');
      this.updateAll();
      this.updatedMap = false;
    }
    const views = this.foldersViews[this.props.selectedFolder];
    return (
      <Masonry
        key={Date.now()} // ???????????????????????????????????
        updateOnEachImageLoad
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
