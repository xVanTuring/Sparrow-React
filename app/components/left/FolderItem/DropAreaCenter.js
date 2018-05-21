import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { NativeTypes } from 'react-dnd-html5-backend';
import { FolderType } from '../../../types/app';
import { ImageModel } from '../../center/Image';
import { PRESET_FOLDER_ID } from '../../center/Center';
import NameInput from './NameInput';
import { setFolderRenaming } from '../../../actions/folder';

const { ipcRenderer } = require('electron');

type DropAreaCenterProps = {
  connectDropTarget: any,

  isOver: boolean,
  item: FolderType,
  isHover: boolean,
  selectedFolder: string,
  isDragging: boolean,
  onDropFolder?: Function,
  size: number,
  fixed?: boolean,

  renamingFolder: string,
  setRenamingFolder: (id) => void

};
class DropAreaCenter extends Component<DropAreaCenterProps> {
  componentDidMount() {
    if (this.props.item.name === '--RENAME--') {
      this.props.setRenamingFolder(this.props.item.id);
    }
  }
  handleDoubleClick = () => {
    if (!this.props.fixed) {
      this.props.setRenamingFolder(this.props.item.id);
    }
  }
  handleNameChange = (name) => {
    let finalName = name;
    if (name === '--RENAME--') {
      finalName = 'Untitled';
    }
    ipcRenderer.send('setFolderName', [this.props.item.id, finalName]);
  }
  render() {
    const {
      connectDropTarget,
      isOver,
      item,
      isHover,
      selectedFolder,
      isDragging,
      onDropFolder,
      size,
      renamingFolder,
      fixed
    } = this.props;
    const hoverColor = (isHover ? 'rgba(192, 192, 192, 0.2)' : '');
    const selectedColor = (selectedFolder === item.id ? 'rgba(192, 192, 192, 0.3)' : hoverColor);
    const overColor = (isOver && onDropFolder) ? 'rgb(25, 153, 238)' : selectedColor;
    const draggingColor = isDragging ? '' : overColor;
    const backgroundColor = this.props.item.id === renamingFolder ? '' : draggingColor;
    return connectDropTarget((
      <div
        style={{
          color: 'white',
          backgroundColor,
          borderRadius: 4,
          lineHeight: '32px',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 12,
          right: 0,
          textAlign: 'left',
          paddingLeft: 4,
          WebkitTransition: ' all .2s',
          fontSize: 14
        }}
        onDoubleClick={this.handleDoubleClick}
      >
        {item.name}
        <span
          style={{
            float: 'right',
            marginRight: 12,
            lineHeight: '28px',
            opacity: this.props.item.id === renamingFolder ? 0 : 1
          }}
        >
          {size}
        </span>
        {
          (this.props.item.id === renamingFolder && !fixed) ?
            (
              <NameInput
                id={this.props.item.id}
                value={this.props.item.name}
                editing
                onChange={this.handleNameChange}
              />
            ) : ''
        }
      </div>
    ));
  }
}
const areaTarget = {
  drop(props, monitor) {
    if (props.onDropFolder) {
      props.onDropFolder({
        dropId: props.item.id,
        dragData: monitor.getItem(),
        type: 'CenterDrop'
      });
    }
  }
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}
const calcType = (props) => {
  if (props.item.id === PRESET_FOLDER_ID[0] || props.isDragging || (!props.onDropFolder)) {
    return [];
  }
  if (props.item.id === PRESET_FOLDER_ID[3]) {
    return ['FolderItem', ImageModel];
  }
  return ['FolderItem', NativeTypes.FILE, ImageModel];
};
const mapStateToProps = (state) => (
  {
    renamingFolder: state.renamingFolder
  }
);
const mapDispatchToProps = (dispatch) => (
  {
    setRenamingFolder: (id) => {
      dispatch(setFolderRenaming(id));
    }
  }
);
const AreaCenter = DropTarget(calcType, areaTarget, collect)(DropAreaCenter);
export default connect(mapStateToProps, mapDispatchToProps)(AreaCenter);
