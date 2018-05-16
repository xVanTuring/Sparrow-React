import React, { Component } from 'react';
import { Tooltip, message } from 'antd';

const { clipboard } = require('electron');

message.config({
  maxCount: 3,
});

type ColorPanType = {
  colorPan: string[]
};
class ColorPan extends Component<ColorPanType> {
  handleColorClick = (color) => {
    clipboard.writeText(color);
    message.success('Color Copied!', 0.7);
  }
  render() {
    const { colorPan } = this.props;
    return (
      <div
        style={{
          height: 18,
          width: 'calc(100%-18px)',
          margin: '8px 16px',
          // backgroundColor: 'blue'
        }}
      >
        {
          colorPan.map((item) => (
            // try with pop and show rgb hsv ...
            <Tooltip
              title={item}
              key={item}
            >
              <div
                style={{
                  display: 'inline-block',
                  width: '20%',
                  height: 12,
                  backgroundColor: item,
                }}
                onClick={() => { this.handleColorClick(item) }}
              />
            </Tooltip>

          ))
        }
      </div>
    );
  }
}
export default ColorPan;
