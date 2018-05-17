import React, { Component } from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
import { PRESET_FOLDER_ID } from '../center/Center';
import { selectFolder, setFolders } from '../../actions/folder';
import DragFolderItem from './FolderItem';

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
          />
          <DragFolderItem
            item={{
              id: PRESET_FOLDER_ID[3],
              name: 'Trash',
              children: []
            }}
            key={PRESET_FOLDER_ID[0]}
            onClick={this.handleFolderItemClick}
            selectedFolder={selectedFolder}
            setDraggingNodeId={this.setDraggingNodeId}
            draggingNodeId={this.state.draggingNodeId}
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
              marginLeft: 16
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
