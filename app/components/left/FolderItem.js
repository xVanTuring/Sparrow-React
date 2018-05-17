import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import DropAreaTop from './DropAreaTop';
import DropAreaBottom from './DropAreaBottom';
import DropAreaCenter from './DropAreaCenter';
import { FolderType } from '../../types/app';

type FolderItemProps = {
  connectDragSource: Function,
  connectDragPreview: Function,

  item: FolderType,
  onClick: Function,
  setDraggingNodeId: Function,
  selectedFolder: string,
  draggingNodeId: string,
  isParentDragging?: boolean
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
    this.setState({
      collapsed: !this.state.collapsed
    });
    this.props.onClick(this.props.item.id);
    console.log(this.state.collapsed);
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
      isParentDragging
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
                    width: 12
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
              />
              <DropAreaTop
                item={item}
                isDragging={isDragging}
              />
              <DropAreaBottom
                item={item}
                isDragging={isDragging}
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
  beginDrag(props) {
    props.setDraggingNodeId(props.item.id);
    return { ids: [props.item.id] };
  },
  endDrag(props) {
    props.setDraggingNodeId('');
  }
};
function collect(_connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: _connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    connectDragPreview: _connect.dragPreview(),
  };
}
const DragFolderItem = DragSource('FolderItem', folderSource, collect)(FolderItem);
export default DragFolderItem;
