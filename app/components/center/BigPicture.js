import React, { Component } from 'react';
import { ImageType } from '../../types/app';
import Annotation from './Annotation';


type BigPictureProps = {
  img: ImageType
};
class BigPicture extends Component<BigPictureProps> {
  constructor(props) {
    super(props);
    this.resizeTimer = null;
    this.state = {
      containerHeight: 0,
      containerWidth: 0,
      staticTop: NaN,
      staticLeft: NaN,
      scale: 1
    };
    this.autoFit = true;
    this.container = React.createRef();
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    setTimeout(() => {
      this.setState({
        containerHeight: this.container.current.offsetHeight,
        containerWidth: this.container.current.offsetWidth
      });
    }, 150);
  }
  componentWillReceiveProps() {
    this.autoFit = true;
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.setState({
        containerHeight: this.container.current.offsetHeight,
        containerWidth: this.container.current.offsetWidth,
      });
    }, 100);
  }
  handleWheel = (e) => {
    if (this.dragging && this.dragging.dragging) {
      return;
    }
    e.persist();
    this.autoFit = false;
    if (e.shiftKey) {
      this.setState({
        staticLeft: this.left + e.deltaY
      });
    } else if (e.ctrlKey) {
      this.setState((prev) => {
        let scale = prev.scale + (e.deltaY < 0 ? 0.05 : -0.05);
        if (scale < 0.3) {
          scale = 0.3;
        }
        if (scale > 2) {
          scale = 2;
        }
        return {
          scale
        };
      });
    } else {
      this.setState({
        staticTop: this.top - e.deltaY
      });
    }
  }
  handleMouseDown = (e) => {
    this.dragging = {
      dragging: true,
      x: e.clientX,
      y: e.clientY,
      left: this.left,
      top: this.top
    };
  }
  handleMouseMove = (e) => {
    if (this.dragging && this.dragging.dragging) {
      const deltaX = e.clientX - this.dragging.x;
      const deltaY = e.clientY - this.dragging.y;
      this.setState({
        staticLeft: this.dragging.left + deltaX,
        staticTop: this.dragging.top + deltaY
      });
    }
  }
  handleMouseUp = () => {
    if (this.dragging) {
      this.dragging.dragging = false;
    }
  }
  onContextMenu = (e) => {
    e.preventDefault();
  }
  render() {

    const {
      img,

    } = this.props;
    const {
      containerWidth,
      containerHeight,
      staticTop,
      staticLeft,
      scale
    } = this.state;
    let resultH;
    let resultW;
    if (this.autoFit) {
      [resultW, resultH] =
        calcSize(img.width, img.height, containerWidth - 48, containerHeight - 48);
      this.resultW = resultW;
      this.resultH = resultH;
    }
    const left = staticLeft || (containerWidth - (this.resultW)) / 2;
    const top = staticTop || (containerHeight - 32 - (this.resultH)) / 2;
    this.top = top;
    this.left = left;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'absolute',
        }}
        ref={this.container}
        onWheel={this.handleWheel}
      >
        {
          this.resultW <= 0 ? '' :
            (
              <div
                style={{
                  width: this.resultW,
                  height: this.resultH,
                  position: 'absolute',
                  transform: `translate(${left}px,${top}px) scale(${scale},${scale})`,
                  cursor: 'pointer',
                  transformOrigin: 'center center'
                }}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                onContextMenu={this.onContextMenu}
              >
                <img
                  draggable={false}
                  style={{
                    width: this.resultW,
                    height: this.resultH,
                    position: 'absolute'
                  }}
                  alt="pic"
                  src={`/home/xvan/Sparrow/images/${img.id}/${img.name}.${img.ext}`}
                />
              </div>
            )
        }

      </div>
    );
  }
}
// TODO: better calc for small image
const calcSize = (imgW, imgH, maxW, maxH) => {
  if (imgW < maxW && imgH < maxH) {
    return [imgW, imgH];
  }
  const scaleW = maxW / imgW;
  const resultH = scaleW * imgH;
  if (resultH <= maxH) {
    return [maxW, resultH];
  }
  const scaleH = maxH / imgH;
  const resultW = scaleH * imgW;
  return [resultW, maxH];
};
export default BigPicture;
