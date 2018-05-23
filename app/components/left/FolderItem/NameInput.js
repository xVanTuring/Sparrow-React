import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapToArr, setFolderName, saveFoldersToFile } from '../../../utils/utils';
import { setFolderRenaming, setFolders } from '../../../actions/folder';

type NameInputProps = {
  value: string,
  setRenamingFolder: (id: string) => void,
  onChange: (e) => void,
  editing: boolean,
  isNewFolder?: boolean,
  foldersArr: FolderType[],
  folders: [],
  id: string,
  setFolders: Function
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
    this.props.setRenamingFolder('');
    let resultName = this.state.value.trim();
    if (resultName === '') {
      resultName = this.props.value;
    }
    let finalName = resultName;
    if (resultName === '--RENAME--') {
      finalName = 'Untitled';
    }
    this.setState({
      value: finalName
    });
    const newFolders = setFolderName(this.props.id, finalName, this.props.folders);
    this.props.setFolders(newFolders);
    saveFoldersToFile(newFolders);
  }
  handleOnChange = (event) => {
    const rest = this.props.foldersArr.filter((item) => {
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
      // esc
      this.props.setRenamingFolder('');
      this.setState({
        value: this.props.value
      });
      if (this.props.isNewFolder) {
        this.props.onChange(this.props.value);
      }
    } else if (e.keyCode === 13) {
      // enter
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
          left: 0,
          right: 0,
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
            top: 0,
            bottom: 0,
            boxSizing: 'border-box',
            backgroundColor: '#a1a1a1',
            color: 'white',
            lineHeight: '28px',
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
  foldersArr: toArr(state.folders),
  folders: state.folders
});
const mapDispatchToProps = (dispatch) => (
  {
    setRenamingFolder: (id) => {
      dispatch(setFolderRenaming(id));
    },
    setFolders: (folders) => {
      dispatch(setFolders(folders));
    }
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(NameInput);
