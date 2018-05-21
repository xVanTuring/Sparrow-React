import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapToArr } from '../../../utils/utils';
// import { List } from 'immutable';

type NameInputProps = {
  value: string,
  // setFolderRenaming: (id: string) => void,
  onChange: (e) => void,
  editing: boolean,
  isNewFolder?: boolean,
  folders: FolderType[],
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
  componentDidMount() {
    if (this.input != null) {
      this.input.focus();
      if (!this.selected) {
        this.input.select();
        this.selected = true;
      }
    }
  }
  handleOnBlur = () => {
    // this.props.setFolderRenaming('');
    this.props.onChange(this.state.value.trim());
    this.setState({
      value: this.state.value.trim()
    });
  }
  handleOnChange = (event) => {
    const rest = this.props.folders.filter((item) => {
      if ((item.name === event.target.value) && (item.id !== this.props.id)) {
        return true;
      }
      return false;
    });
    this.setState({
      value: event.target.value,
      sameName: rest.length > 0
    });
  }
  handleOnKeyDown = (e) => {
    if (e.keyCode === 27) {
      // this.props.setFolderRenaming('');
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
    const { editing } = this.props;
    const { value, sameName } = this.state;
    if (!editing) {
      return '';
    }
    return (
      <div
        style={{
          position: 'absolute',
          left: 4,
          right: 6,
          top: 0,
          bottom: 0,
        }}
        onClick={(e) => {
          e.stopPropagation();
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
            fontSize: '14px',
            borderRadius: 4,
            paddingLeft: 3,
            height: 24,
            top: 3,
            boxSizing: 'border-box',
            backgroundColor: '#a1a1a1',
            color: 'white',
            lineHeight: '24px',
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
const toArr = (folders) => {
  const arr = [];
  mapToArr(folders, arr);
  return arr;
};
const mapStateToProps = (state) => ({
  folders: toArr(state.folders)
});

export default connect(mapStateToProps)(NameInput);
