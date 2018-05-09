import React, { Component } from 'react';
// import folder_indicator from "./folder_indicator.svg";
import { connect } from 'react-redux';
import { selectFolder } from '../../actions/folder';
import uuidv1 from 'uuid/v1';
// todo: Add Support for Mutli-Select
// const predefinedIcons = {
//   un_cate: '',
//   all: '',
//   un_tag: '',
//   all_tag: '',
//   trash: '',
//   folder: ''
// };
type FolderItemProps = {
  id: string,
  onFolderClick: (id: string) => void,
  level: number,
  title: string,
  size: number,
  subFolders: [],
  select_folder_id: string
};
class FolderItem extends Component<FolderItemProps> {
  constructor(props) {
    super(props);
    this.folderId = this.props.id || uuidv1();
    this.state = {
      hover: false,
      collpased: false
    };
  }
  handleEnter = () => {
    this.setState({ hover: true });
  }
  handleLeave = () => {
    this.setState({ hover: false });
  }
  handleClick = () => {
    this.props.onFolderClick(this.folderId);
    this.setState({
      collpased: !this.state.collpased
    });
  }
  render() {
    const nameLeft = 40 + ((this.props.level || 0) * 14);
    const imgLeft = 16 + ((this.props.level || 0) * 14);
    let visibility = false;
    if (this.props.select_folder_id === this.folderId) {
      visibility = true;
    } else if (this.state.hover) {
      visibility = true;
    }
    return (
      <div>
        <div
          style={{
            height: 28,
            textAlign: 'center',
            position: 'relative',
            left: 4,
            marginBottom: 2,
          }}
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
          onClick={this.handleClick}
        >
          <div
            style={{
              background: '#77777760',
              position: 'absolute',
              left: 0,
              right: 8,
              top: 0,
              bottom: 0,
              borderRadius: '6px',
              visibility: visibility ? 'visible' : 'hidden',
            }}
          />

          <img
            // src={folder_indicator}
            style={{
              width: 12,
              position: 'absolute',
              left: (this.props.level || 0) * 14,
              top: 8,
              visibility: (this.props.subFolders != null) ? 'visible' : 'hidden'
            }}
            alt="folder"
          />
          <img
            // src={All}
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
            }}
          >
            {this.props.title || 'All'}
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
            {this.props.size || 0}
          </span>

        </div>
        <div
          style={{
            display: this.state.collpased ? '' : 'none'
          }}
        >
          {
            generateFolder(this.props.subFolders)
          }
        </div>
      </div>
    );
  }
}
const generateFolder = (subFolders) => {
  if (subFolders == null) {
    return '';
  }
  return subFolders.map((item) => {
    console.log('');
    return (
      <RFolderItem
        title={item.title}
        size={item.size}
        key={item.title}
        level={item.level}
        subFolders={item.subFolders}
      />
    );
  });
};
const mapStateToProps = (state) => {
  console.log('');
  return {
    select_folder_id: state.folders.get('select_folder_id')
  };
};
const mapDispatchToProps = (dispatch) => {
  console.log('');
  return {
    onFolderClick: (id) => {
      dispatch(selectFolder(id));
    }
  };
};
const RFolderItem = connect(mapStateToProps, mapDispatchToProps)(FolderItem);
export default RFolderItem;
