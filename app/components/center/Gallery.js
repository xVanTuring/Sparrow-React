import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { List } from 'immutable';
import Image from './Image';
import { ImageType } from '../../types/app';

type GalleryProps = {
  images: List<ImageType>,
  onImageDoubleClick: () => void
};
class Gallery extends Component<GalleryProps> {
  constructor(props) {
    super(props);
    this.state = {
      pageElements: []
    };
  }
  componentWillReceiveProps(props) {
    if (props.images !== this.props.images) {
      this.setState({
        pageElements: []
      });
    }
  }
  shouldComponentUpdate(nextProp, nextState) {
    if (nextState.pageElements !== this.state.pageElements) {
      return true;
    }
    if (nextProp.images !== this.props.images) {
      return true;
    }
    return true;
  }
  loadMore = (page) => {
    this.setState({
      pageElements: this.props.images.slice(0, 10 * page)
    });
  }

  render() {
    return (
      <InfiniteScroll
        className="wrap"
        loadMore={this.loadMore}
        hasMore
        useWindow={false}
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
  }
);
export default connect(mapStateToProps)(Gallery);
