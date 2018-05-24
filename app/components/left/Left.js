import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import _ from 'lodash';
import uuid from 'uuid/v1';
import { PRESET_FOLDER_ID } from '../center/Center';
import { selectFolder, setFolders } from '../../actions/folder';
import addDarker from '../../assets/add_darker.svg';
import addLight from '../../assets/add_white.svg';
import DragFolderItem from './FolderItem/FolderItem';
import { movePrepend, moveAfter, moveBefore, toFileData, mapToArr, createNewFolder, saveFoldersToFile } from '../../utils/utils';
import { ImageType, FolderType } from '../../types/app';


const { ipcRenderer } = require('electron');

type LeftProp = {
  folders: [],
  selectedFolder: string,
  setFolders: (folders: []) => void,
  selectFolder: (id: string) => void,
  counter: { [x: string]: number },
  folderArr: FolderType[],
  altKey: boolean
};
class Left extends Component<LeftProp> {
  constructor(props) {
    super(props);
    this.state = {
      draggingNodeId: '',
      hoverAdd: false
    };
  }
  handleFolderItemClick = (id) => {
    this.props.selectFolder(id);
  }
  handleAddFolderClick = () => {
    let parentFolder = '';
    if (this.props.selectedFolder === '' ||
      this.props.selectedFolder === PRESET_FOLDER_ID[0] ||
      this.props.selectedFolder === PRESET_FOLDER_ID[3]) {
      parentFolder = '';
    } else {
      for (let index = 0; index < this.props.folderArr.length; index += 1) {
        const element = this.props.folderArr[index];
        if (element.id === this.props.selectedFolder) {
          parentFolder = element.parent;
          break;
        }
      }
    }

    const newFolders = createNewFolder(parentFolder, this.props.folders);
    this.props.setFolders(newFolders);
    saveFoldersToFile(newFolders);
  }
  handleMouseEnterAdd = () => {
    this.setState({
      hoverAdd: true
    });
  }
  handleMouseLeaveAdd = () => {
    this.setState({
      hoverAdd: false
    });
  }
  setDraggingNodeId = (id) => {
    this.setState({
      draggingNodeId: id
    });
  }
  onDropFolder = (e: { dropId: string, dragData: {}, type: string }) => {
    if (e.dropId === PRESET_FOLDER_ID[3]) {
      if (e.dragData.images != null) {
        ipcRenderer.send('deleteImages', [e.dragData.images]);
      }

      return;
    }
    if (e.dragData.folders != null) {
      let data = this.props.folders;
      const { dropId, dragData, type } = e;
      const dragId = dragData.folders[0];
      switch (type) {
        case 'CenterDrop':
          data = movePrepend(dragId, dropId, data);
          this.props.setFolders(data);
          break;
        case 'TopDrop':
          data = moveBefore(dragId, dropId, data);
          this.props.setFolders(data);
          break;
        case 'BottomDrop':
          data = moveAfter(dragId, dropId, data);
          this.props.setFolders(data);
          break;
        default:
          break;
      }
      saveFoldersToFile(data);
      // save
    } else if (e.dragData.images != null) {
      ipcRenderer.send('addImagesToFolder', [e.dragData.images, e.dropId, !this.props.altKey]);
    }
  };
  render() {
    const {
      selectedFolder,
      counter,
      folderArr
    } = this.props;
    const {
      hoverAdd
    } = this.state;
    return ((
      <div
        className="right_border"
        style={{
          width: 200,
          height: '100vh',
          backgroundColor: '#535353',
          position: 'relative'
        }}
      >
        <div
          className="bottom_border "
          style={{
            // width: 230,
            height: 32,
            background: '#535353',
            lineHeight: '32px',
            textAlign: 'left',
            paddingLeft: '12px',
            color: '#fff',
            fontSize: 14
          }}
        >
          Assets
        </div>
        <div
          style={{
            marginTop: 8,
            marginRight: 4
          }}
        >
          <DragFolderItem
            item={{
              id: PRESET_FOLDER_ID[0],
              name: 'All',
              children: []
            }}
            key={PRESET_FOLDER_ID[0]}
            onClick={this.handleFolderItemClick}
            selectedFolder={selectedFolder}
            setDraggingNodeId={this.setDraggingNodeId}
            draggingNodeId={this.state.draggingNodeId}
            fixed
            counter={counter}
          />
          <DragFolderItem
            item={{
              id: PRESET_FOLDER_ID[3],
              name: 'Trash',
              children: []
            }}
            key={PRESET_FOLDER_ID[3]}
            onClick={this.handleFolderItemClick}
            selectedFolder={selectedFolder}
            setDraggingNodeId={this.setDraggingNodeId}
            draggingNodeId={this.state.draggingNodeId}
            fixed
            onDropFolder={this.onDropFolder}
            counter={counter}
          />
        </div>


        <div
          style={{
            marginRight: 4
          }}
        >
          <div
            style={{
              color: '#a0a0a0',
              fontSize: 10,
              lineHeight: '18px',
              height: 18,
              marginLeft: 8,
              marginRight: 8
            }}
          >
            <span
              style={{
                height: 18,
                lineHeight: '18px'
              }}
            >
              {`Folder (${folderArr.length})`}
            </span>
            <img
              style={{
                height: 16,
                float: 'right',
                cursor: 'pointer',
                padding: 2
              }}
              alt="img"
              src={hoverAdd ? addLight : addDarker}
              onClick={this.handleAddFolderClick}
              onMouseEnter={this.handleMouseEnterAdd}
              onMouseLeave={this.handleMouseLeaveAdd}
            />
          </div>
          {
            this.props.folders.map(item => {
              return (
                <DragFolderItem
                  item={item}
                  key={item.id}
                  onClick={this.handleFolderItemClick}
                  selectedFolder={selectedFolder}
                  setDraggingNodeId={this.setDraggingNodeId}
                  draggingNodeId={this.state.draggingNodeId}
                  onDropFolder={this.onDropFolder}
                  counter={counter}
                />
              );
            })
          }
        </div>

      </div>));
  }
}
const calcFolderSize = (images: List<ImageType>) => {
  const counter = {

  };
  counter[PRESET_FOLDER_ID[3]] = 0;

  counter[PRESET_FOLDER_ID[0]] = 0;
  images.forEach((item) => {
    if (item.isDeleted) {
      counter[PRESET_FOLDER_ID[3]] += 1;
    } else {
      counter[PRESET_FOLDER_ID[0]] += 1;
      item.folders.forEach((name) => {
        if (counter[name]) {
          counter[name] += 1;
        } else {
          counter[name] = 1;
        }
      });
    }
  });
  return counter;
};
const toArr = (folders) => {
  const arr = [];
  mapToArr(folders, arr);
  return arr;
};
const mapStateToProps = (state) => (
  {
    folders: state.folders,
    selectedFolder: state.selectedFolder,
    counter: calcFolderSize(state.images),
    folderArr: toArr(state.folders),
    altKey: state.altKey
  }
);
const mapDispatchToProps = (dispatch) => (
  {
    selectFolder: (id) => {
      dispatch(selectFolder(id));
    },
    setFolders: (folders: []) => {
      dispatch(setFolders(folders));
    }
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Left);
