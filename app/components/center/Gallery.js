import React, { Component } from 'react';
import { JustifiedLayout } from '@egjs/react-infinitegrid';
import { connect } from 'react-redux';
// import settings from 'electron-settings';
import { List } from 'immutable';
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
      images: filter(this.props.images, this.props.selectedFolder),
      pageElement: [],
      column: 4
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedFolder !== this.props.selectedFolder) {
      this.setState({
        pageElement: [],
        images: filter(nextProps.images, nextProps.selectedFolder),
      });
    } else if (nextProps.imageHeight !== this.props.imageHeight) {
      const column =
        Math.ceil((document.body.offsetWidth - 430 - 40) / this.props.imageHeight);
      if (this.state.column !== column) {
        this.setState({
          column
        });
      }
    } else if (nextProps.images !== this.props.images) {
      this.setState({
        // pageElement: [],
        images: filter(nextProps.images, nextProps.selectedFolder),
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.imageHeight !== this.props.imageHeight) {
      this.layout.layout();
    }
  }
  loadItems = (groupKey, start) => {
    return this.state.images.slice(start, start + 60).map(item => {
      return {
        groupKey,
        item
      };
    }).toArray();
  };
  onAppend = ({ groupKey }) => {
    if (this.state.images.size > this.state.pageElement.length) {
      const { pageElement } = this.state;
      const start = pageElement.length;
      const items = this.loadItems((groupKey || 0) + 1, start);
      this.setState({ pageElement: pageElement.concat(items) });
    }
  };
  handleResize = () => {
    let column = Math.ceil((document.body.offsetWidth - 430 - 40) / this.props.imageHeight);
    if (column >= 7) {
      column = 6;
    }
    if (this.state.column !== column) {
      this.setState({
        column
      });
    }
  }

  render() {
    return (
      <div
        id="infinite-grid-container"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto'
        }}
      >
        <JustifiedLayout
          column={this.state.column}
          ref={ref => {
            this.layout = this.layout || ref;
          }}
          onAppend={this.onAppend}
          threshold={500}
          margin={16}
          style={{
            width: 'calc(100% - 40px)',
            margin: '0 auto',
            marginTop: 8,
          }}
          containerId="infinite-grid-container"
        >
          {
            this.state.pageElement.map(item => {
              return (
                <Image
                  groupKey={item.groupKey}
                  key={item.item.id}
                  displayImages={this.state.images}
                  onImageDoubleClick={this.props.onImageDoubleClick}
                  image={item.item}
                />
              );
            })
          }
        </JustifiedLayout>
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
