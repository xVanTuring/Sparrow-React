import React, { Component } from 'react';

class Right extends Component {
  render() {
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
          }}
        />
      </div>);
  }
}
export default Right;
