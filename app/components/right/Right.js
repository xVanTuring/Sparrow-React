import React, { Component } from 'react';
import { Input, Divider, } from 'antd';
import { connect } from 'react-redux';
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

    const { images, basePath } = this.props;
    this.imgPath = null;
    this.img = null;
    if (images != null && images.size > 0) {
      this.img = images.get(0);
      this.imgPath = `${basePath}/images/${this.img.id}/${this.img.name}_thumb.${this.img.ext}`;
    }
    this.state = {
      currentName: this.img ? this.img.name : ''
    };
  }
  componentWillReceiveProps(nextProps) {
    const { images, basePath } = nextProps;
    if (images != null && images.size > 0) {
      this.img = images.get(0);
      this.imgPath = `${basePath}/images/${this.img.id}/${this.img.name}_thumb.${this.img.ext}`;
    } else {
      this.img = null;
      this.imgPath = null;
    }
    this.setState({
      currentName: this.img ? this.img.name : ''
    });
  }
  // handleOnClick = (e) => {
  //   e.stopPropagation();
  // }
  handleNameBlur = (name) => {

  }

  render() {
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
          this.img == null ?
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
                  src={this.imgPath}
                  alt="detail"
                  style={{
                    maxWidth: 140,
                    maxHeight: 180,
                    display: 'block',
                    margin: 'auto',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.23)'
                  }}
                />
                <ColorPan colorPan={this.img.palette} />
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
                  value={this.state.currentName}
                  onChange={(e) => {
                    this.setState({
                      currentName: e.target.value
                    });
                  }}
                  onPressEnter={() => {
                    this.handleNameBlur(this.state.currentName);
                  }}
                  onBlur={() => {
                    console.log('OnBlur');
                    this.handleNameBlur(this.state.currentName);
                    // save
                  }}
                />
                <Input
                  style={{
                    marginTop: 16,
                  }}
                />
                <TagArea
                  imgTags={this.img.tags}
                  currentId={this.img.id}
                />

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
