import React, { Component } from 'react';
import { Input, Divider, List, } from 'antd';
import { connect } from 'react-redux';
import settings from 'electron-settings';
import ColorPan from './ColorPan';
import STag from './STag';
import TagArea from './TagArea';
import { mapToArr } from '../../utils/utils';
import { FolderType, ImageType } from '../../types/app';

const { ipcRenderer } = require('electron');

type RightProps = {
  images: List<ImageType> | undefined,
  folders: FolderType[]
};
class Right extends Component<RightProps> {
  constructor(props) {
    super(props);

    if (this.props.images) {
      this.state = {
        currentName: this.props.images.get(0).name,
        currentAnno: this.props.images.get(0).annotation
      };
    } else {
      this.state = {
        currentName: null,
        currentAnno: null
      };
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.images) {
      this.setState({
        currentName: nextProps.images.get(0).name
      });
    } else {
      this.setState({
        currentName: null
      });
    }
  }

  handleNameBlur = (name) => {
    if (name !== '' && (name !== this.props.images.get(0).name) && (!this.nameInputCancelBlur)) {
      ipcRenderer.send('setImageName', [this.props.images.get(0).id, name]);
    } else {
      this.nameInputCancelBlur = false;
      this.setState({
        currentName: this.props.images.get(0).name
      });
    }
  }
  handleFolderTagClosed = (id) => {
    ipcRenderer.send('deleteImageFolder', [this.props.images.get(0).id, id]);
  }

  render() {
    const {
      images,
      folders
    } = this.props;
    let selectedImage = null;
    let selectedImagePath = '';
    const folderTag = [];
    if (images != null && images.size > 0) {
      selectedImage = images.get(0);
      selectedImagePath = `${settings.get('rootDir')}/images/${selectedImage.id}/${selectedImage.name}_thumb.png`;

      folders.forEach(item => {
        selectedImage.folders.forEach(item2 => {
          if (item.id === item2) {
            folderTag.push(item);
          }
        });
      });
    }
    return (
      <div
        style={{
          position: 'absolute',
          height: '100vh',
          backgroundColor: '#535353',
          width: 230,
          right: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div
          className="bottom_border "
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
          selectedImage == null ?
            (
              <div
                style={{
                  color: 'white',
                  textAlign: 'center',
                  width: '100%',
                  height: 'calc(100% - 32px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span>
                  Select Image To View Detail
                </span>
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
                  src={selectedImagePath}
                  alt="detail"
                  style={{
                    maxWidth: 140,
                    maxHeight: 180,
                    display: 'block',
                    margin: 'auto',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.23)'
                  }}
                />
                <ColorPan colorPan={selectedImage.palette} />
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
                  value={this.state.currentName == null ? selectedImage.name : this.state.currentName}
                  onChange={(e) => {
                    this.setState({
                      currentName: e.target.value
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 27) {
                      if (this.nameInput) {
                        this.nameInputCancelBlur = true;
                        this.nameInput.blur();
                      }
                    }
                  }}
                  onPressEnter={() => {
                    this.handleNameBlur(this.state.currentName);
                  }}
                  onBlur={() => {
                    this.handleNameBlur(this.state.currentName);
                  }}
                  ref={(ref) => { this.nameInput = ref; }}
                />
                <TagArea
                  currentTags={selectedImage.tags}
                  currentId={selectedImage.id}
                />

                <Input.TextArea
                  style={{
                    height: 90,
                    width: '100%',
                    marginTop: 16,
                    lineHeight: '14px',
                    backgroundColor: '#333',
                    color: 'white',
                    outline: 'none',
                    resize: 'none',
                    fontSize: '12px'
                  }}
                  placeholder="Add Annotation"
                  value={this.state.currentAnno}
                  onChange={(e) => {
                    this.setState({
                      currentAnno: e.target.value
                    });
                  }}
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
                  {
                    folderTag.map(item => {
                      return (
                        <STag value={item.name} key={item.id} id={item.id} onClose={this.handleFolderTagClosed} />
                      );
                    })
                  }
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
const ToArr = (folders) => {
  const arr = [];
  mapToArr(folders, arr);
  return arr;
};
const mapStateToProps = (state) => (
  {
    images: filter(state.images, state.selectedImgs),
    folders: ToArr(state.folders)
  }
);
export default connect(mapStateToProps)(Right);
