import React, { Component } from 'react';

type NameInputProps = {
  nameLeft: number,
  value: string,
  setFolderRenaming: (id: string) => void,
  onChange: (e) => void,
  editing: boolean
};
class NameInput extends Component<NameInputProps> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
    this.input = null;
    this.selected = false;
  }
  componentDidUpdate() {
    if (this.input != null) {
      this.input.focus();
      if (!this.selected) {
        this.input.select();
        this.selected = true;
      }
    }
  }
  handleOnBlur = () => {
    this.props.setFolderRenaming('');
    this.props.onChange(this.state.value);
  }

  handleOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.input.blur();
    }
  }
  handleOnChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }
  render() {
    const { nameLeft, editing } = this.props;
    const { value } = this.state;
    if (!editing) {
      return '';
    }
    return (
      <div
        style={{
          position: 'absolute',
          left: nameLeft - 4,
          right: 6,
          top: 0,
          bottom: 0,
          // display: (renamingFolderId === id) ? '' : 'none',
        }}
      >
        <input
          ref={(e) => {
            this.input = e;
            // if ((renamingFolderId === id)) {
            //   if (this.input != null) {
            //     this.input.focus();
            //     this.input.select();
            //   }
            // }
          }}
          style={{
            width: '100%',
            display: 'block',
            position: 'absolute',
            border: '0px',
            outline: 'none',
            fontSize: '13px',
            borderRadius: 4,
            paddingLeft: 4,
            height: 22,
            top: 3,
            boxSizing: 'border-box',
            backgroundColor: '#a1a1a1',
            color: 'white',
            lineHeight: '22px'
          }}
          value={value}
          maxLength={25}
          type="text"
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
          onKeyPress={this.handleOnKeyPress}
        />
      </div>);
  }
}
export default NameInput;
