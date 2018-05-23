import React, { Component } from 'react';
import { Icon } from 'antd';

const electron = require('electron');

const { ipcRenderer } = electron;
const { dialog, app } = electron.remote;
const path = require('path');

class WelCome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetPath: path.join(app.getPath('documents'), 'Sparrow'),
      mouseDown: false
    };
    this.selecting = false;
  }
  handleTargetPath = () => {
    this.selecting = true;
    const targetPath = dialog.showOpenDialog({
      title: 'Select Library Path',
      properties: ['openDirectory']
    });
    if (targetPath && targetPath.length > 0) {
      this.setState({
        targetPath: path.join(targetPath[0], 'Sparrow')
      });
    }
  }
  handleNextClick = () => {
    ipcRenderer.send('createLibrary', this.state.targetPath);
  }
  handleMouseEnter = () => {
    this.setState({
      mouseDown: true
    });
  }
  handleMouseLeave = () => {
    this.setState({
      mouseDown: false
    });
  }
  render() {
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          backgroundColor: '#424242',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <img
          src="./dist/logo.png"
          style={{
            width: 300,
            height: 300,
            marginTop: -60
          }}
          alt="233"
        />
        <div
          style={{
            color: 'white',
            backgroundColor: '#606060',
            padding: '8px 6px 8px 16px',
            width: 250,
            borderRadius: '4px',
            cursor: 'text',
            marginTop: 60
          }}
          onClick={this.handleTargetPath}
        >
          {this.state.targetPath}
        </div>
        <div
          style={{
            // width: 150,
            backgroundColor: this.state.mouseDown ? '#2779DD' : '#4E9DFF',
            padding: '8px 60px',
            marginTop: 16,
            borderRadius: 4,
            cursor: 'pointer',
            WebkitTransition: 'all .3s'
          }}
          onClick={this.handleNextClick}
          onMouseDown={this.handleMouseEnter}
          onMouseUp={this.handleMouseLeave}
        >
          <Icon
            type="right"
            style={{
              color: 'white'
            }}
          />
        </div>
      </div>
    );
  }
}
export default WelCome;
