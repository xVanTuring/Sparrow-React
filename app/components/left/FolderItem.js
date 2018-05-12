import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { selectFolder, setFolderRenaming } from '../../actions/folder';
import FolderDropArea from './FolderDropArea';
import NameInput from './NameInput';

const { ipcRenderer } = require('electron');

export type FolderType = {
  name: string,
  id: string,
  children: FolderType[]
};
export const FolderModel = 'FolderItem';
type FolderItemProps = {
  id?: string,
  onFolderClick: (id: string) => void,
  onRenaming: (id: string) => void,
  level?: number,
  name: string,
  subFolders?: FolderType[],
  select_folder_id?: string,
  connectDragSource: any,
  isDragging: boolean,
  fixedFolder?: boolean,
  renamingFolderId: string,
  isOverLeft: boolean,
  size: number,
  counter?: { [x: string]: number }
};
class FolderItem extends Component<FolderItemProps> {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.state = {
      hover: false,
      collapsed: false,
      newName: this.props.name
    };
    this.input = null;
  }
  componentDidMount() {
    if (this.props.name === '--RENAME--') {
      this.props.onRenaming(this.id);
    }
  }

  handleEnter = () => {
    this.setState({ hover: true });
  }
  handleLeave = () => {
    this.setState({ hover: false });
  }
  handleClick = () => {
    this.props.onFolderClick(this.id);
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  handleDoubleClick = () => {
    this.props.onRenaming(this.id);
    // this.setState({
    //   isEditing: true
    // }, () => {
    //   // this works 😀
    //   this.input.focus();
    //   this.input.select();
    // });
  }
  handleOnChange = (value) => {
    // notify ipcMain to update file
    this.setState({
      newName: value
    });
    if (value !== this.props.name) {
      console.log(this.id);
      ipcRenderer.send('renameFolder', [this.id, value]);
    }
  }

  render() {
    const {
      connectDragSource,
      isDragging,
      fixedFolder,
      renamingFolderId,
      id,
      isOverLeft,
      size,
      counter
    } = this.props;
    const { hover, newName } = this.state;
    const nameLeft = 40 + ((this.props.level || 0) * 14);
    const imgLeft = 16 + ((this.props.level || 0) * 14);
    let visibility = false;

    if (this.props.select_folder_id === this.id) {
      visibility = true;
    } else if (hover) {
      visibility = true;
    }

    return connectDragSource((
      <div>
        <div
          style={{
            height: 28,
            textAlign: 'center',
            position: 'relative',
            left: 4,
            marginBottom: 2,
            lineHeight: '28px',
            // backgroundColor: 'blue'
          }}
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
          onClick={this.handleClick}
        >
          <div
            className="hover_indicator"
            style={{
              backgroundColor: `rgba(119, 119, 119, ${visibility ? '0.6' : '0'})`,
              position: 'absolute',
              left: 0,
              right: 8,
              top: 0,
              bottom: 0,
              borderRadius: '6px',
              paddingRight: 30,
              lineHeight: '28px',
            }}
          >
            <img
              src="./dist/folder_indicator.svg"
              style={{
                width: 12,
                position: 'absolute',
                left: (this.props.level || 0) * 14,
                top: 8,
                visibility: (this.props.subFolders != null && this.props.subFolders.length !== 0) ? 'visible' : 'hidden'
              }}
              alt="folder"
            />
            <img
              src="./dist/all_imgs.svg"
              style={{
                width: 16,
                position: 'absolute',
                left: imgLeft,
                top: 6,
              }}
              alt="all"
            />
            <span
              style={{
                color: 'white',
                lineHeight: '28px',
                fontSize: 13,
                position: 'absolute',
                left: nameLeft,
                right: 38,
                textAlign: 'left',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
              onDoubleClick={this.handleDoubleClick}
            >
              {newName}
            </span>
            <span
              style={{
                position: 'absolute',
                right: 18,
                color: 'white',
                lineHeight: '28px',
                fontSize: 10,
                textAlign: 'right'
              }}
            >
              {size}
            </span>
            {
              fixedFolder ? '' :
                (<NameInput
                  nameLeft={nameLeft}
                  value={newName === '--RENAME--' ? 'New Folder' : newName}
                  setFolderRenaming={this.props.onRenaming}
                  onChange={this.handleOnChange}
                  editing={renamingFolderId === id}
                  isNewFolder={newName === '--RENAME--'}
                  id={this.id}
                />)
            }


          </div>
          {
            isOverLeft ? (
              <FolderDropArea selfDragging={isDragging} fixedFolder={fixedFolder} id={this.id} />
            ) : ''
          }


        </div>
        <div
          style={{
            display: this.state.collapsed ? '' : 'none'
          }}
        >

          {
            generateFolder(this.props.subFolders, (this.props.level || 0) + 1, counter, isOverLeft)
          }
        </div>
      </div>
    ));
  }
}
const generateFolder = (subFolders?: FolderType[], level: number, counter, isOverLeft) => {
  if (subFolders == null || subFolders.length === 0) {
    return '';
  }
  // console.log(subFolders);
  return subFolders.map((item) => (
    (
      <RFolderItem
        name={item.name}
        id={item.id}
        size={counter[item.id] || 0}
        key={item.id}
        level={level}
        isOverLeft={isOverLeft}
        subFolders={item.children}
        counter={counter}
      />
    )
  ));
};
const mapStateToProps = (state) => (
  {
    select_folder_id: state.selectFolder,
    renamingFolderId: state.renamingFolder
  }
);
const mapDispatchToProps = (dispatch) => (
  {
    onFolderClick: (id) => {
      dispatch(selectFolder(id));
    },
    onRenaming: (id) => {
      dispatch(setFolderRenaming(id));
    }
  }
);

const imageSource = {
  beginDrag(props, monitor, component) {
    // console.log(component);
    return { folder: props.id };
  },
  canDrag(props, monitor) {
    if (props.id === props.renamingFolderId || props.fixedFolder) {
      return false;
    }
    return true;
  }
};
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}
const DragFolder = DragSource(FolderModel, imageSource, collect)(FolderItem);
const RFolderItem = connect(mapStateToProps, mapDispatchToProps)(DragFolder);
export default RFolderItem;
