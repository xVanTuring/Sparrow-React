import React, { Component } from 'react';
import { Tag, Icon } from 'antd';
type STagProps = {
  color: string,
  onClose?: Function,
  onClick?: Function,
  value?: string,
  closable?: boolean,
  type?: string // 0 1 2
};
class STag extends Component<STagProps> {
  render() {
    const {
      color,
      onClose,
      onClick,
      value,
      closable
    } = this.props;
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
          // closable={closable}
          color={color}
        // onClose={onClose}
        >
          {value == null ? this.props.children : value}
        </Tag>
      </div>
    );
  }
}
export default STag;
