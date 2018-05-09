import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import Image from './Image';

class Center extends Component {
  render() {
    return (
      <div
        className="right_border"
        style={{
          position: 'absolute',
          // height: '100vh',
          backgroundColor: '#535353',
          left: 230,
          right: 200,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="bottom_border"
          style={{
            height: 32,
            background: '#535353',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 32,
            bottom: 0,
            right: 200,
            left: 0,
            backgroundColor: '#303030',
            overflow: 'auto'
          }}
        >
          <Masonry
            style={{
              margin: '4px auto'
            }}
            options={{
              fitWidth: true,
            }}
          >
            {
              generateImg()
            }
          </Masonry>
        </div>
      </div>);
  }
}
let generateImg = () => {
  const res = [];
  for (let index = 0; index < 30; index += 1) {
    res.push(<Image src="./img/one.jpg" key={`./img/two.jpg ${index}`} />);
  }
  return res;
};
export default Center;
