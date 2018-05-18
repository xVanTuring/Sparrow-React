import React, { Component } from 'react';
import { Input, Divider, } from 'antd';
import { connect } from 'react-redux';
import randomWords from 'random-words';
import ColorPan from './ColorPan';
import STag from './STag';
import TagArea from './TagArea';

type RightProps = {
  images: any,
  basePath: string
};
class Right extends Component<RightProps> {
  constructor(props) {
    super(props);
    this.data = randomWords(70).concat(['233', '😀', '💛', '🔞🈲', 'city', 'brave']);
    this.selected = ['brave', 'bowl', 'at', 'city'];
    this.state = {
      tags: this.data
    };
  }
  handleOnClick = (e) => {
    e.stopPropagation();
  }
  handleCreateTag = (name) => {
    this.setState({
      tags: this.state.tags.concat([name])
    });
  }
  render() {
    const { images, basePath } = this.props;
    let imgPath = null;
    let img = null;
    if (images != null && images.size > 0) {
      img = images.get(0);
      imgPath = `${basePath}/images/${img.id}/${img.name}_thumb.${img.ext}`;
    }
    return (
      <div
        style={{
          position: 'absolute',
          height: '100vh',
          backgroundColor: '#535353',
          width: 200,
          right: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div
          className="bottom_border right_border"
          style={{
            height: 32,
            background: '#535353',
            lineHeight: '32px',
            color: 'white',
            textAlign: 'center',
            fontSize: '12px'
          }}
        >
          Detail
        </div>
        {
          img == null ?
            (
              <div
                style={{
                  color: 'white',
                  textAlign: 'center',
                  margin: 'auto'
                }}
              >
                Select One
              </div>
            )
            : (
              <div
                style={{
                  padding: '8px 16px 40px 16px',
                  overflow: 'scroll',
                  height: '100%'
                }}
              >
                <img
                  src={imgPath == null ? '' : imgPath}
                  alt="detail"
                  style={{
                    maxWidth: 140,
                    maxHeight: 180,
                    display: 'block',
                    margin: 'auto',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.23)'
                  }}
                />
                <ColorPan colorPan={img.palette} />
                <div
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}
                >
                  1 selected
                </div>
                <Input
                  style={{
                    marginTop: 16,

                  }}
                  value={img.name}
                  onChange={() => { }}
                />
                <Input
                  style={{
                    marginTop: 16,
                  }}
                />
                <TagArea tags={this.state.tags} onCreateTag={this.handleCreateTag} />

                <Input.TextArea
                  style={{
                    height: 90,
                    marginTop: 16,
                    backgroundColor: '#333',
                    color: 'white',
                    outline: 'none',
                    resize: 'none',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    // border: '1px solid transparent'
                  }}
                  placeholder="Add Annotation"
                />
                <Divider style={{
                  backgroundColor: '#333',
                  marginTop: 16,
                  marginBottom: 16
                }}
                />
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      marginBottom: '4px'
                    }}
                  >
                    In Folders
                  </div>
                  <STag value="Night" />
                  <STag value="Night" />
                  <STag value="Night" />
                </div>
                <Divider style={{
                  backgroundColor: '#333',
                  marginTop: 16,
                  marginBottom: 8
                }}
                />
              </div>)
        }
      </div>);
  }
}
const filter = (images, selected) => {
  if (selected.size > 0) {
    return images.filter((item) => {
      return item.id === selected.get(0);
    });
  }
};
const mapStateToProps = (state) => (
  {
    images: filter(state.images, state.selectedImgs),
    basePath: state.basePath
  }
);
export default connect(mapStateToProps)(Right);
