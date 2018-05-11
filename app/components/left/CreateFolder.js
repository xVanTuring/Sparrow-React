import React, { Component } from 'react';

const { ipcRenderer } = require('electron');

class CreateFolder extends Component {
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
    ipcRenderer.send('addFolder', ['Material Design', '']);
  }
  render() {
    return (
      [
        <div
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
export default CreateFolder;
