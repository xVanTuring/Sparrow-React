import React, { Component } from 'react';
import { Input, Tag, Divider, Popover, Icon } from 'antd';
import { connect } from 'react-redux';
import AlphabetList from 'react-alphabet-list';
import randomWords from 'random-words';
import ColorPan from './ColorPan';
import STag from './STag';

type RightProps = {
  images: any,
  basePath: string
};
class Right extends Component<RightProps> {
  constructor(props) {
    super(props);
    this.data = randomWords(70).concat(['233', '😀', '💛', '🔞🈲', 'city', 'brave']);
    this.selected = ['brave', 'bowl', 'at', 'city'];
  }
  handleOnClick = (e) => {
    e.stopPropagation();
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
                <Popover
                  style={{
                    backgroundColor: '#333'
                  }}
                  placement="left"
                  trigger="click"
                  title={
                    <div
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      Tags
                    </div>
                  }
                  content={
                    <div
                      style={{
                        padding: '0px 4px',
                        width: 300,
                        // height: 400
                      }}
                    >
                      <Input.Search placeholder="Search yours tags" onSearch={value => console.log(value)} />
                      <div
                        style={{
                          marginTop: 12
                        }}
                      >
                        <AlphabetList
                          style={{
                            width: 300,
                            height: 360
                          }}
                          data={this.data}
                          generateFn={
                            (item, index) => {
                              return (
                                <Tag
                                  color={item === 'city' ? '#2db7f5' : 'rgb(42, 42, 42)'}
                                  key={item + index}
                                >
                                  <Icon type={item === 'city' ? 'check' : 'plus'} style={{ margin: '0 4px 0 0' }} />
                                  {item}
                                </Tag>
                              );
                            }
                          }
                        />
                      </div>
                    </div>
                  }
                >
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
                    <STag color="#2db7f5" value="Night" type="1" />
                    <STag color="#2db7f5" value="Lake" type="1" />
                    <STag color="#2db7f5" value="Temp" type="1" />
                    <STag color="#2db7f5" value="City" type="1" />
                  </div>
                </Popover>

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
