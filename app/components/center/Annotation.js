import React, { Component } from 'react';
// TODO: add anno
class Annotation extends Component {
  render() {
    return (
      <div
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'rgba(96, 199, 247, 0.3)',
          border: '1px solid rgba(96, 199, 247, 0.8)',
          position: 'absolute',
          boxSizing: 'border-box',
          transform: 'translate(200px,250px)'
        }}
      >

      </div>
    );
  }
}
export default Annotation;
