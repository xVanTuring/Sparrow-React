import React, { Component } from 'react';
import { Tooltip, message } from 'antd';

const { clipboard } = require('electron');

message.config({
  maxCount: 3,
});

type ColorPanType = {
  colorPan: { color: number[], ratio: number }[]
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
        }}
      >
        {
          colorPan.map((item) => {
            const color = `rgb(${item.color[0]},${item.color[1]},${item.color[2]})`;
            return (
              <Tooltip
                title={color}
                key={color}
              >
                <div
                  style={{
                    display: 'inline-block',
                    width: '20%',
                    height: 12,
                    backgroundColor: color
                  }}
                  onClick={() => { this.handleColorClick(color) }}
                />
              </Tooltip>
            );
          })
        }
      </div>
    );
  }
}
export default ColorPan;
