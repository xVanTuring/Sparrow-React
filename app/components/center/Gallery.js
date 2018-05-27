import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import InfiniteScroll from './InfiniteScroll';
import Image from './Image';
import { ImageType } from '../../types/app';
import { filter } from './Center';

type GalleryProps = {
  images: List<ImageType>,
  selectedFolder: string,
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
    this.scrollTopMap = {};
  }
  componentDidMount() {
    // console.log(this.infinte.scrollComponent.parentNode.scrollTop);
    window.addEventListener('resize', this.handleResize);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.infinte.scrollComponent.parentNode.scrollTop);
    if (nextProps.selectedFolder !== this.props.selectedFolder) {
      this.scrollTopMap[this.props.selectedFolder] =
        this.infinte.scrollComponent.parentNode.scrollTop;
      this.setState({
        pageElements: List([]),
        images: filter(nextProps.images, nextProps.selectedFolder)
      });
    }
  }
  shouldComponentUpdate(nextProp, nextState) {
    if (nextState.pageElements !== this.state.pageElements ||
      nextState.pageLoaded !== this.state.pageLoaded ||
      nextProp.images !== this.state.images) {
      return true;
    }
    if (nextProp.images !== this.props.images ||
      nextProp.selectedFolder !== this.props.selectedFolder) {
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
        className="wrap"
        pageStart={this.state.pageLoaded.get(this.props.selectedFolder, 0)}
        loadMore={this.loadMore}
        hasMore
        useWindow={false}
        ref={(re) => {
          if (re) {
            this.infinte = re;
          }
        }}
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
            />
          ))
        }
      </InfiniteScroll>

    );
  }
}
const mapStateToProps = (state) => (
  {
    images: state.images,
    selectedFolder: state.selectedFolder // filter(state.images, state.selectedFolder)
  }
);
export default connect(mapStateToProps)(Gallery);
