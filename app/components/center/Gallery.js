import React, { Component } from 'react';
import { JustifiedLayout } from '@egjs/react-infinitegrid';
import { connect } from 'react-redux';
import settings from 'electron-settings';
import { List } from 'immutable';
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry
} from 'react-virtualized';
import Image from './Image';
import { ImageType } from '../../types/app';
import { filter } from './Center';

// TODO: add init children about 50-70 items
// TODO: lazy load
type GalleryProps = {
  images: List<ImageType>,
  selectedFolder: string,
  imageHeight: number,
  onImageDoubleClick: () => void
};
class Gallery extends Component<GalleryProps> {
  constructor(props) {
    super(props);
    this.state = {
      images: filter(this.props.images, this.props.selectedFolder)
    };
    this.cellWidth = 250;
    this.cache = new CellMeasurerCache({
      defaultHeight: 100,
      defaultWidth: this.cellWidth,
      fixedWidth: true
    });
    this.cellPositioner = createMasonryCellPositioner({
      cellMeasurerCache: this.cache,
      columnCount: 3,
      columnWidth: this.cellWidth,
      spacer: 10
    });
  }
  // Our masonry layout will use 3 columns with a 10px gutter between
  cellRenderer = ({
    index,
    key,
    parent,
    style
  }) => {
    const image = this.state.images.get(index);
    // console.log(index, style);
    // if (style.top != null) {
    //   posCache[index] = {
    //     width: style.width,
    //     height: style.height,
    //     x: style.left,
    //     y: style.top
    //   };
    // }
    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <img
            src={`${settings.get('rootDir')}/images/${image.id}/${image.name}_thumb.png`}
            style={{
              height: image.height * (this.cellWidth / image.width),
              width: this.cellWidth
            }}
            alt="img"
          />
        </div>
      </CellMeasurer>
    );
  }

  render() {
    // const children = this.state.images.map((item) => (
    //   <Image
    //     key={item.item.id}
    //     groupKey={item.groupKey}
    //     displayImages={this.props.images}
    //     onImageDoubleClick={this.props.onImageDoubleClick}
    //     image={item.item}
    //   />));
    return (
      <div>
        <Masonry
          cellCount={this.state.images.size}
          cellMeasurerCache={this.cache}
          cellPositioner={this.cellPositioner}
          overscanByPixels={100}
          cellRenderer={this.cellRenderer}
          height={600}
          width={800}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => (
  {
    images: state.images,
    selectedFolder: state.selectedFolder,
    imageHeight: state.imageHeight
  }
);
export default connect(mapStateToProps)(Gallery);
