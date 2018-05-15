import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Tree, Icon } from 'antd';
import { PRESET_FOLDER_ID } from '../center/Center';
import { selectFolder, setFolders } from '../../actions/folder';

const { TreeNode } = Tree;

type LeftProp = {
  folders: [],
  setFolders: (folders: []) => void,
  selectFolder: (id: string) => void
};
class Left extends Component<LeftProp> {
  // constructor(props) {
  //   super(props);
  // }
  onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const { dropPosition } = info;
    const loop = (data, id, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id === id) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, id, callback);
        }
      });
    };
    const data = _.clone(this.props.folders); // [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    }
    this.props.setFolders(data);
  };
  onClick = (ids: []) => {
    if (ids.length > 0) {
      this.props.selectFolder(ids[0]);
    } else {
      this.props.selectFolder('');
    }
  }
  render() {
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode
              key={item.id}
              title={item.name}
              icon={
                ({ expanded }) => (<Icon type={expanded ? 'folder-open' : 'folder'} />)
              }
            >
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (<TreeNode
          icon={({ expanded }) => (<Icon type={expanded ? 'folder-open' : 'folder'} />)
          }
          key={item.id}
          title={item.name}
        />);
      });
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
        {/* TODO: fix some style problem and multi-tree selection */}
        {/* <div>
          <Tree
            showIcon
            className="tree fixed-tree"
            onSelect={this.onClick}
          >

          </Tree>
        </div> */}

        <div>
          <Tree
            autoExpandParent
            showIcon
            className="tree"
            draggable
            onDrop={this.onDrop}
            onSelect={this.onClick}
          >
            <TreeNode
              key={PRESET_FOLDER_ID[0]}
              title="All"
              icon={
                <Icon type="folder" />
              }
            />
            <TreeNode
              key={PRESET_FOLDER_ID[3]}
              title="Trash"
              icon={
                <Icon type="folder" />
              }
            />
            <div
              style={{
                color: '#a0a0a0',
                fontSize: 10,
                lineHeight: '18px',
                marginLeft: 12,
                height: 18
              }}
            >
              Folder (11)
            </div>
            {loop(this.props.folders)}
          </Tree>
        </div>

      </div>));
  }
}
const mapStateToProps = (state) => (
  {
    folders: state.folders
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
