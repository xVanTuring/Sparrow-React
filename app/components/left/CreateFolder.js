import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PRESET_FOLDER_ID } from '../center/Center';

const { ipcRenderer } = require('electron');

type CreateFolderProps = {
  selectedFolder: string
};
class CreateFolder extends Component<CreateFolderProps> {
  constructor(props) {
    super(props);
    this.state = {
      isHoverAdd: false,
      isHoverHide: false
    };
  }
  handleAddEnter = () => {
    this.setState({
      isHoverAdd: true
    });
  }
  handleAddLeave = () => {
    this.setState({
      isHoverAdd: false
    });
  }
  handleHideEnter = () => {
    this.setState({
      isHoverHide: true
    });
  }
  handleHideLeave = () => {
    this.setState({
      isHoverHide: false
    });
  }
  handleAddClick = () => {
    let selectedId = '';
    const { selectedFolder } = this.props;
    switch (selectedFolder) {
      case PRESET_FOLDER_ID[0]:
      case PRESET_FOLDER_ID[1]:
      case PRESET_FOLDER_ID[2]:
      case PRESET_FOLDER_ID[3]:
        break;
      default:
        selectedId = selectedFolder;
        break;
    }
    ipcRenderer.send('addFolder', ['--RENAME--', selectedId]);
  }
  render() {
    return (
      [
        <div
          key="1"
          style={{
            height: 18,
            float: 'right',
            marginRight: 10,
            fontSize: 10,
            color: this.state.isHoverHide ? '#fff' : '#bfbfbf',
            lineHeight: '18px',
            cursor: 'pointer',
          }}
          onMouseEnter={this.handleHideEnter}
          onMouseLeave={this.handleHideLeave}
        >
          hide
        </div>,
        <img
          key="2"
          style={{
            height: 16,
            width: 16,
            float: 'right',
            marginRight: 10,
            cursor: 'pointer',
          }}
          alt="add"
          src={this.state.isHoverAdd ? './dist/add.svg' : './dist/add_dark.svg'}
          onMouseEnter={this.handleAddEnter}
          onMouseLeave={this.handleAddLeave}
          onClick={this.handleAddClick}
        />]);
  }
}

const mapStateToProps = (state) => (
  {
    selectedFolder: state.selectFolder
  }
);
export default connect(mapStateToProps)(CreateFolder);
