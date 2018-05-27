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
  onImageDoubleClick: () => void,
  setScrollTop: (value: number) => void,
  scrollTop: number
};
class Gallery extends Component<GalleryProps> {
  constructor(props) {
    super(props);
    this.state = {
      pageElements: List([]),
      pageLoaded: Map(),
      images: filter(this.props.images, this.props.selectedFolder)
    };
    // this.infinte = React.createRef();
    this.scrollTop = 0;
    this.scrollTopMap = {};
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.selectedFolder === this.props.selectedFolder) {
    //   this.scrollTopMap[this.props.selectedFolder] = nextProps.scrollTop;
    // }
    // if (nextProps.selectedFolder === this.props.selectedFolder) {
    //   this.scrollTopMap[this.props.selectedFolder] = nextProps.scrollTop;
    // }

    if (nextProps.images !== this.props.images ||
      nextProps.selectedFolder !== this.props.selectedFolder) {
      this.setState({
        pageElements: List([]),
        images: filter(nextProps.images, nextProps.selectedFolder),
        pageLoaded: this.state.pageLoaded.set(this.props.selectedFolder, 0)
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.pageElements !== this.state.pageElements ||
      nextState.pageLoaded !== this.state.pageLoaded ||
      nextState.images !== this.state.images) {
      return true;
    }
    if (nextProps.images !== this.props.images ||
      nextProps.selectedFolder !== this.props.selectedFolder) {
      return false;
    }
    return false;
  }
  componentDidUpdate() {
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
        pageElements: this.state.images.slice(0, 10 * page).map((item) => (
          <Image
            key={item.id}
            displayImages={this.props.images}
            onImageDoubleClick={this.props.onImageDoubleClick}
            image={item}
          />
        )),
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
        hasMore={this.state.images.size > this.state.pageElements.size}
        useWindow={false}
        style={{
          margin: '0 auto',
          width: 'calc(100% - 24px)',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {
          this.state.pageElements
        }
      </InfiniteScroll>

    );
  }
}
const mapStateToProps = (state) => (
  {
    images: state.images,
    selectedFolder: state.selectedFolder
  }
);
export default connect(mapStateToProps)(Gallery);
