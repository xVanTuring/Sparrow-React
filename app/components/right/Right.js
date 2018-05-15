import React, { Component } from 'react';
import { Input, Tag, Divider } from 'antd';
import ColorPan from './ColorPan';


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
            lineHeight: '32px',
            color: 'white',
            textAlign: 'center',
            fontSize: '12px'
          }}
        >
          Detail
        </div>
        <div
          style={{
            padding: '8px 16px 40px 16px',
            overflow: 'scroll',
            height: '100%'
          }}
        >
          <img
            src="/home/xvan/Sparrow/images/2c1ab0a0-57f9-11e8-a96c-cf3e3227659b/02_thumb.jpg"
            alt="detail"
            style={{
              width: 160,
              display: 'block',
              margin: 'auto',
              boxShadow: '0 2px 6px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.23)'
            }}
          />
          <ColorPan />
          <div
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '12px'
            }}
          >
            1 selected
          </div>
          <Input
            style={{
              marginTop: 16,
              height: 24,
              backgroundColor: '#333',
              color: 'white',
              border: '0px',
              outline: 'none'
            }}
          />
          <Input
            style={{
              marginTop: 16,
              height: 24,
              backgroundColor: '#333',
              color: 'white',
              border: '0px',
              outline: 'none'
            }}
          />
          <div
            style={{
              marginTop: 16,
              backgroundColor: '#333',
              height: 90,
              padding: 8,
              cursor: 'text',
              borderRadius: '4px',
              overflow: 'scroll',
              overflowX: 'hidden'
            }}
          >
            <Tag closable color="#2db7f5">Night</Tag>
            <Tag closable color="#2db7f5">Temple</Tag>
            <Tag closable color="#2db7f5">Lake</Tag>
          </div>
          <Input.TextArea
            style={{
              height: 90,
              marginTop: 16,
              backgroundColor: '#333',
              color: 'white',
              border: '0px',
              outline: 'none',
              resize: 'none'
            }}
            placeholder="Add Annotation"
          />
          <Divider style={{
            backgroundColor: '#333',
            marginTop: 16,
            marginBottom: 16
          }}
          />
          <div>
            <div
              style={{
                color: 'white',
                fontSize: '12px',
                marginBottom: '4px'
              }}
            >
              In Folders
            </div>
            <Tag closable color="#2db7f5">Night</Tag>
          </div>
          <Divider style={{
            backgroundColor: '#333',
            marginTop: 16,
            marginBottom: 8
          }}
          />
          <div>
            <span
              style={{
                color: 'white',
                fontSize: '14px'
              }}
            >
              Basic Info
            </span>
            <br />
            <span
              style={{
                color: '#777',
                fontSize: '12px'
              }}
            >
              Size
            </span>
            <span
              style={{
                color: 'white',
                fontSize: '12px',
                float: 'right'
              }}
            >
              1920x1080
            </span>
            <br />
            <span
              style={{
                color: '#777',
                fontSize: '12px'
              }}
            >
              Format
            </span>
            <span
              style={{
                color: 'white',
                fontSize: '12px',
                float: 'right'
              }}
            >
              JPG
            </span>
            <br />
            <span
              style={{
                color: '#777',
                fontSize: '12px'
              }}
            >
              File Size
            </span>
            <span
              style={{
                color: 'white',
                fontSize: '12px',
                float: 'right'
              }}
            >
              647 KB
            </span>
          </div>
        </div>
      </div>);
  }
}
export default Right;
