import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div
        style={{
          height: '100vh',
          backgroundColor: '#424242',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 18
          }}
        >
          Init...
        </span>
      </div>
    );
  }
}
export default Loading;
