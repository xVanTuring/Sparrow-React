import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

type NameInputProps = {
  nameLeft: number,
  value: string,
  setFolderRenaming: (id: string) => void,
  onChange: (e) => void,
  editing: boolean,
  isNewFolder?: boolean,
  folders: List,
  id: string
};
class NameInput extends Component<NameInputProps> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      sameName: false
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
    this.props.onChange(this.state.value.trim());
    this.setState({
      value: this.state.value.trim()
    });
  }
  handleOnChange = (event) => {
    this.setState({
      value: event.target.value
    });
    const rest = this.props.folders.filter((item) => {
      if ((item.name === event.target.value) && (item.id !== this.props.id)) {
        return true;
      }
      return false;
    });
    this.setState({
      sameName: rest.size > 0
    });
  }
  handleOnKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.props.setFolderRenaming('');
      this.setState({
        value: this.props.value
      });
      if (this.props.isNewFolder) {
        this.props.onChange(this.props.value);
      }
    } else if (e.keyCode === 13) {
      this.input.blur();
    }
  }
  render() {
    const { nameLeft, editing } = this.props;
    const { value, sameName } = this.state;
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

        }}
      >
        <input
          ref={(e) => {
            this.input = e;
          }}
          style={{
            width: '100%',
            display: 'block',
            position: 'absolute',
            border: `1px solid rgba(255, 219, 89, ${sameName ? 0.8 : 0})`,
            outline: 'none',
            fontSize: '13px',
            borderRadius: 4,
            paddingLeft: 3,
            height: 22,
            top: 3,
            boxSizing: 'border-box',
            backgroundColor: '#a1a1a1',
            color: 'white',
            lineHeight: '22px',
          }}
          value={value}
          maxLength={25}
          type="text"
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
        />
      </div>);
  }
}
const mapStateToProps = (state) => ({
  folders: state.folders
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NameInput);
