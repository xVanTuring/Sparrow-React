import React, { Component } from 'react';


type LeftProp = {
};
class Left extends Component<LeftProp> {
  render() {
    return ((
      <div
        className="right_border"
        style={{
          width: 230,
          height: '100vh',
          backgroundColor: '#535353',
          position: 'relative'
        }}
      >
        <div
          className="bottom_border "
          style={{
            // width: 230,
            height: 32,
            background: '#535353',
            lineHeight: '32px',
            textAlign: 'left',
            paddingLeft: '12px',
            color: '#fff',
            fontSize: 12
          }}
        >
          Sparrow
        </div>
        <div
          style={{
            height: 18,
            // backgroundColor: 'red'
          }}
        >
          <div
            style={{
              color: '#a0a0a0',
              fontSize: 10,
              lineHeight: '18px',
              marginLeft: 12,
              float: 'left',
              height: 18
            }}
          >Folder (11)
          </div>
        </div>
      </div>));
  }
}


export default Left;
