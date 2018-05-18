import React, { Component } from 'react';
import { Tag, Icon } from 'antd';

type STagProps = {
  color?: string,
  onClose?: Function,
  onClick?: Function,
  value?: string,
  type?: string // 0 1 2
};
class STag extends Component<STagProps> {
  render() {
    const {
      color,
      onClose,
      onClick,
      value,
      type
    } = this.props;
    switch (type) {
      case '1':
        // closeable
        return (
          <div
            style={{
              display: 'inline-block'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick != null) {
                onClick(e);
              }
            }}
          >
            <Tag
              closable
              color={color}
              onClose={() => { onClose(value); }}
            >
              {value == null ? this.props.children : value}
            </Tag>
          </div>
        );
      case '2':
        // add
        return (
          <div
            style={{
              display: 'inline-block'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick != null) {
                onClick(this.props.value, 'add');
              }
            }}
            onContextMenu={(e) => {
              // delete without save to history
              e.preventDefault();
            }}
          >
            <Tag
              color={color || 'rgb(51, 51, 51)'}
            >
              <Icon type="plus" style={{ margin: '0 4px 0 0' }} />
              {value == null ? this.props.children : value}
            </Tag>
          </div>
        );
      case '3':
        // added with check icon
        return (
          <div
            style={{
              display: 'inline-block'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick != null) {
                onClick(value, 'remove');
              }
            }}
            onContextMenu={(e) => {
              // delete without save to history
              e.preventDefault();
            }}
          >
            <Tag
              color={color || 'rgb(45, 183, 245)'}
            >
              <Icon type="check" style={{ margin: '0 4px 0 0' }} />
              {value == null ? this.props.children : value}
            </Tag>
          </div>
        );
      default:
        // folder closeable
        return (
          <div
            style={{
              display: 'block'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick != null) {
                onClick(e);
              }
            }}
          >
            <Tag
              color={color ? color : 'rgb(45, 183, 245)'}
              closable
              onClose={onClose}
            >
              <Icon type="folder" style={{ margin: '0 4px 0 0' }} />
              {value == null ? this.props.children : value}
            </Tag>
          </div>
        );
    }
  }
}
export default STag;
