import React, { Component } from 'react';

class ColorPan extends Component {
  render() {
    const colorPan = ['#eae725', '#ffbd60', '#878787', '#65757a', '#f76a6a'];
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
          colorPan.map((item) => {
            return (
              <div
                style={{
                  display: 'inline-block',
                  width: '20%',
                  height: 12,
                  backgroundColor: item
                }}
              />
            );
          })
        }
      </div>
    );
  }
}
export default ColorPan;
