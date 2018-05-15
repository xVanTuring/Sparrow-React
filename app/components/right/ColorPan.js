import React, { Component } from 'react';

type ColorPanType = {
  colorPan: string[]
};
class ColorPan extends Component<ColorPanType> {
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
            <div
              style={{
                display: 'inline-block',
                width: '20%',
                height: 12,
                backgroundColor: item
              }}
            />
          ))
        }
      </div>
    );
  }
}
export default ColorPan;
