import React, { Component } from 'react';

class TopController extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (<div
      className="bottom_border"
      style={{
        height: 32,
        background: '#535353',
      }}
    />);
  }
}
export default TopController;
