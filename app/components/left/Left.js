import React, { Component } from 'react';
import { Tree, Icon } from 'antd';

const TreeNode = Tree.TreeNode;

type LeftProp = {
};
class Left extends Component<LeftProp> {
  constructor(props) {
    super(props);
    const root = [
      {
        id: '1',
        name: 'xVan',
        children: [
          {
            id: '2',
            name: 'ling',
            children: [
              { id: '777', name: 'ling', children: [] },
              { id: '77', name: 'ling', children: [] }
            ]
          }
        ]
      },
      {
        id: '4',
        name: 'Chou',
        children: [{ id: '20', name: 'Bai', children: [] }]
      }
    ];
    this.state = {
      gData: root
    };
  }
  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    // const dropPos = info.node.props.pos.split("-");
    const dropPosition = info.dropPosition;
    // - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
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
    const data = [...this.state.gData];
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
    this.setState({
      gData: data
    });
  };
  onClick = (ids: []) => {
    const id = ids[0];
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
          width: 230,
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
            height: 18,
            // backgroundColor: 'red'
          }}
        >
          <div
            style={{
              color: '#a0a0a0',
              fontSize: 10,
              lineHeight: '18px',
              marginLeft: 12,
              float: 'left',
              height: 18
            }}
          >Folder (11)
          </div>
        </div>
        <Tree
          autoExpandParent
          showIcon
          className="draggable-tree"
          draggable
          onDrop={this.onDrop}
          onSelect={this.onClick}
        >
          {loop(this.state.gData)}
        </Tree>

      </div>));
  }
}


export default Left;
