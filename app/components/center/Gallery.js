import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import InfiniteScroll from './InfiniteScroll';
import Image from './Image';
import { ImageType } from '../../types/app';
import { filter } from './Center';

// TODO: add init children about 50-70 items
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
      pageElements: List([]),
      pageLoaded: Map(),
      images: filter(this.props.images, this.props.selectedFolder)
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.images !== this.props.images ||
      nextProps.selectedFolder !== this.props.selectedFolder) {
      if (nextProps.selectedFolder !== this.props.selectedFolder) {
        this.setState({
          pageElements: List([]),
          images: filter(nextProps.images, nextProps.selectedFolder),
          pageLoaded: this.state.pageLoaded.set(this.props.selectedFolder, 0)
        });
      } else {
        this.setState({
          images: filter(nextProps.images, nextProps.selectedFolder),
          pageLoaded: this.state.pageLoaded.set(this.props.selectedFolder, 0)
        });
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.pageElements !== this.state.pageElements ||
      nextState.pageLoaded !== this.state.pageLoaded ||
      nextState.images !== this.state.images) {
      return true;
    }
    if (nextProps.images !== this.props.images ||
      nextProps.selectedFolder !== this.props.selectedFolder ||
      nextProps.imageHeight !== this.props.imageHeight) {
      return true;
    }
    return false;
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize = () => {
    this.forceUpdate();
  }
  loadMore = (page) => {
    if (this.state.images.size > this.state.pageElements.size) {
      const newData = this.state.pageLoaded.set(this.props.selectedFolder, page);
      this.setState({
        pageElements: this.state.images.slice(0, 10 * page),
        pageLoaded: newData
      });
    }
  }
  render() {
    return (
      <InfiniteScroll
        pageStart={this.state.pageLoaded.get(this.props.selectedFolder, 0)}
        loadMore={this.loadMore}
        hasMore={this.state.images.size > this.state.pageElements.size}
        useWindow={false}
        className="wrap"
        style={{
          margin: '0 auto',
          width: 'calc(100% - 24px)',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {
          this.state.pageElements.map((item) => (
            <Image
              key={item.id}
              displayImages={this.props.images}
              onImageDoubleClick={this.props.onImageDoubleClick}
              image={item}
            />))
        }
      </InfiniteScroll>

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
