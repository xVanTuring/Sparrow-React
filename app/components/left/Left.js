import React, { Component } from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
import { PRESET_FOLDER_ID } from '../center/Center';
import { selectFolder, setFolders } from '../../actions/folder';
import DragFolderItem from './FolderItem';
import { movePrepend, moveAfter, moveBefore, toFileData } from '../../utils/utils';

const { ipcRenderer } = require('electron');

type LeftProp = {
  folders: [],
  selectedFolder: string,
  setFolders: (folders: []) => void,
  selectFolder: (id: string) => void
};
class Left extends Component<LeftProp> {
  constructor(props) {
    super(props);
    this.state = {
      draggingNodeId: ''
    };
  }
  handleFolderItemClick = (id) => {
    this.props.selectFolder(id);
  }
  setDraggingNodeId = (id) => {
    this.setState({
      draggingNodeId: id
    });
  }
  onDropFolder = (e: { dropId: string, dragData: {}, type: string }) => {
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
      const fileData = toFileData(data);
      ipcRenderer.send('saveFolders', [fileData]);
      // save
    } else if (e.dragData.images != null) {
      console.log('images');
    }
  };
  render() {
    const { selectedFolder } = this.props;
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
            fontSize: 12
          }}
        >
          Sparrow
        </div>
        <div
          style={{
            marginTop: 8
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
            onDropFolder={this.onDropFolder}
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
              marginLeft: 8
            }}
          >
            Folder (11)
          </div>
          {
            // "\E606"
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
                />
              );
            })
          }
        </div>

      </div>));
  }
}
const mapStateToProps = (state) => (
  {
    folders: state.folders,
    selectedFolder: state.selectedFolder
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
