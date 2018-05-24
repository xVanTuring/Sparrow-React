import React, { Component } from 'react';
import logo from '../../assets/logo.svg';

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
        <img
          src={logo}
          style={{
            width: 400,
            height: 400,
            marginTop: -60
          }}
          alt="233"
        />
      </div>
    );
  }
}
export default Loading;
