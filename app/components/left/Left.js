import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { NativeTypes } from 'react-dnd-html5-backend';
import FixedFolders from './FixedFolder';
import Folders from './Folders';
import { ImageModel } from '../center/Image';
import CreateFolder from './CreateFolder';
import { ImageType } from '../../types/app';
import { PRESET_FOLDER_ID } from '../center/Center';
import { FolderModel } from './FolderItem';

type LeftProp = {
  connectDropTarget: (e) => any,
  isOver: boolean,
  counter: { [x: string]: number }
};
class Left extends Component<LeftProp> {
  render() {
    const { connectDropTarget, isOver, counter } = this.props;
    return connectDropTarget((
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
        <FixedFolders counter={counter} />
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
          <CreateFolder />
        </div>
        <Folders isOverLeft={isOver} counter={counter} />
      </div>));
  }
}

const areaTarget = {
  drop(props, monitor) {
  },
};
function collect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}
const mapStateToProps = (state) => (
  {
    counter: counter(state.images)
  }
);
const counter = (images: List<ImageType>) => {
  const count = {};
  count[PRESET_FOLDER_ID[0]] = 0;
  count[PRESET_FOLDER_ID[3]] = 0;
  images.forEach((item) => {
    if (item.isDeleted) {
      count[PRESET_FOLDER_ID[3]] += 1;
    } else {
      count[PRESET_FOLDER_ID[0]] += 1;

      if (item.folders.length > 0) {
        item.folders.forEach(id => {
          if (count[id] == null) {
            count[id] = 1;
          } else {
            count[id] += 1;
          }
        });
      }
    }
  });
  // console.log(count);
  return count;
};
const DropLeft = DropTarget([ImageModel, FolderModel, NativeTypes.FILE], areaTarget, collect)(Left);
export default connect(mapStateToProps)(DropLeft);
