import React, { Component } from 'react';

type SimpleImageProps = {
  imgPath: string
};
class SimpleImage extends Component<SimpleImageProps> {
  // TODO: use global setting to disable the opacity anim
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.imgPath !== this.props.imgPath || this.state.loaded !== nextState.loaded) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <img
        onLoad={() => {
          this.setState({
            loaded: true
          });
        }}
        src={this.props.imgPath}
        style={{
          width: '100%',
          height: '100%',
          verticalAlign: 'bottom',
          borderRadius: '2px',
          // opacity: `${this.state.loaded ? 1 : 0}`,
          // WebkitTransition: 'opacity 0.5s ease'
        }}
        alt="img"
      />
    );
  }
}
export default SimpleImage;

