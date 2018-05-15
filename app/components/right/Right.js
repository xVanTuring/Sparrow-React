import React, { Component } from 'react';
import { Input, Tag, Divider } from 'antd';
import { connect } from 'react-redux';
import ColorPan from './ColorPan';

type RightProps = {
  images: any,
  basePath: string
};
class Right extends Component<RightProps> {
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
                    width: 140,
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
                    height: 24,
                    backgroundColor: '#333',
                    color: 'white',
                    border: '0px',
                    outline: 'none'
                  }}
                  defaultValue={img.name}
                />
                <Input
                  style={{
                    marginTop: 16,
                    height: 24,
                    backgroundColor: '#333',
                    color: 'white',
                    border: '0px',
                    outline: 'none',
                    lineHeight: '24px'
                  }}
                />
                <div
                  style={{
                    marginTop: 16,
                    backgroundColor: '#333',
                    height: 90,
                    padding: 8,
                    cursor: 'text',
                    borderRadius: '4px',
                    overflow: 'scroll',
                    overflowX: 'hidden'
                  }}
                >
                  <Tag closable color="#2db7f5">Night</Tag>
                  <Tag closable color="#2db7f5">Temple</Tag>
                  <Tag closable color="#2db7f5">Lake</Tag>
                </div>
                <Input.TextArea
                  style={{
                    height: 90,
                    marginTop: 16,
                    backgroundColor: '#333',
                    color: 'white',
                    border: '0px',
                    outline: 'none',
                    resize: 'none'
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
                  <Tag closable color="#2db7f5">Night</Tag>
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
// const mapDispatchToProps = (dispatch) => (
//   {
//   }
// );
export default connect(mapStateToProps)(Right);
