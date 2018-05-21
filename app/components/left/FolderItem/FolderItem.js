import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import DropAreaTop from './DropAreaTop';
import DropAreaBottom from './DropAreaBottom';
import DropAreaCenter from './DropAreaCenter';
import { FolderType } from '../../../types/app';
// import { PRESET_FOLDER_ID } from '../../center/Center';
// TODO: fix folder edit the drapeable
type FolderItemProps = {
  connectDragSource: Function,
  connectDragPreview: Function,

  fixed?: boolean,
  item: FolderType,
  onClick: Function,
  setDraggingNodeId: Function,
  selectedFolder: string,
  draggingNodeId: string,
  isParentDragging?: boolean,
  counter: { [x: string]: number },

  onDropFolder?: Function
};
class FolderItem extends Component<FolderItemProps> {
  constructor(props) {

    super(props);
    this.state = {
      isHover: false,
      collapsed: false
    };
  }
  handleClick = () => {
    if (this.props.item.children && this.props.item.children.length > 0) {
      if (this.props.selectedFolder === this.props.item.id) {
        this.setState({
          collapsed: !this.state.collapsed
        });
      }
    }
    this.props.onClick(this.props.item.id);
  }
  render() {
    const {
      connectDragSource,
      connectDragPreview,

      item,
      onClick,
      selectedFolder,
      setDraggingNodeId,
      draggingNodeId,
      isParentDragging,
      onDropFolder,
      counter
    } = this.props;
    const isDragging = !!isParentDragging || (draggingNodeId === item.id);

    return connectDragSource((
      <div>
        {
          connectDragPreview((
            <div
              style={{
                height: 30,
                position: 'relative',
                marginBottom: 4
              }}
              onMouseEnter={() => { this.setState({ isHover: true }); }}
              onMouseLeave={() => { this.setState({ isHover: false }); }}
              onClick={this.handleClick}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  height: 20,
                  width: 12,
                  visibility: (item.children && item.children.length > 0) ? '' : 'hidden'
                }}
              >
                <img
                  style={{
                    height: 12,
                    width: 12,
                    transform: this.state.collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                    WebkitTransition: 'all .3s'
                  }}
                  alt="icon"
                  src="./dist/folder_indicator.svg"
                />
              </div>
              <DropAreaCenter
                item={item}
                isHover={this.state.isHover}
                selectedFolder={selectedFolder}
                isDragging={isDragging}
                onDropFolder={onDropFolder}
                size={counter[item.id] || 0}
              />
              {/* TODO: make top bottom able to drop img */}
              <DropAreaTop
                item={item}
                isDragging={isDragging}
                onDropFolder={onDropFolder}
              />
              <DropAreaBottom
                item={item}
                isDragging={isDragging}
                onDropFolder={onDropFolder}
              />

            </div>
          ))
        }
        <div
          style={{
            paddingLeft: 18,
            display: (this.state.collapsed || isDragging) ? 'none' : '',
          }}
        >
          {
            item.children.map((subItem) => {
              return (
                <DragFolderItem
                  item={subItem}
                  key={subItem.id}
                  onClick={onClick}
                  selectedFolder={selectedFolder}
                  setDraggingNodeId={setDraggingNodeId}
                  draggingNodeId={draggingNodeId}
                  isParentDragging={isDragging}
                  onDropFolder={onDropFolder}
                  counter={counter}
                />
              );
            })
          }
        </div>
      </div>
    ));
  }
}

const folderSource = {
  canDrag(props) {
    if (props.fixed) {
      return false;
    }
    return true;
  },
  beginDrag(props) {
    props.setDraggingNodeId(props.item.id);
    return { folders: [props.item.id] };
  },
  endDrag(props) {
    props.setDraggingNodeId('');
  }
};
function collect(_connect, monitor) {
  return {
    connectDragSource: _connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: _connect.dragPreview(),
  };
}
const DragFolderItem = DragSource('FolderItem', folderSource, collect)(FolderItem);
export default DragFolderItem;
