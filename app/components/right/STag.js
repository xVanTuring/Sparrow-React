import React, { Component } from 'react';
import { Tag, Icon } from 'antd';

type STagProps = {
  color?: string,
  onClose?: Function,
  onClick?: Function,
  value?: string,
  id?: string,
  type?: string // 0 1 2
};
class STag extends Component<STagProps> {
  handleTypeOneClick = (e) => {
    e.stopPropagation();
    if (this.props.onClick != null) {
      this.props.onClick(e);
    }
  }
  hadleTypeTwoClick = (e) => {
    e.stopPropagation();
    if (this.props.onClick != null) {
      this.props.onClick(this.props.value, 'add');
    }
  };
  handleTypeThreeClick = (e) => {
    e.stopPropagation();
    if (this.props.onClick != null) {
      this.props.onClick(this.props.value, 'remove');
    }
  }
  handleTypeFolderClick = (e) => {
    e.stopPropagation();
    if (this.props.onClick != null) {
      this.props.onClick(e);
    }
  }
  handleTypeOneClose = () => {
    this.props.onClose(this.props.value);
  }
  handleTypeFolderClose = () => {
    this.props.onClose(this.props.id);
  }
  render() {
    const {
      color,
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
            onClick={this.handleTypeOneClick}
          >
            <Tag
              closable
              color={color}
              onClose={this.handleTypeOneClose}
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
            onClick={this.hadleTypeTwoClick}
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
            onClick={this.handleTypeThreeClick}
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
            onClick={this.handleTypeFolderClick}
          >
            <Tag
              color={color || 'rgb(45, 183, 245)'}
              closable
              onClose={this.handleTypeFolderClose}
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
