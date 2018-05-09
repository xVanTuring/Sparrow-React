import React, { Component } from 'react';
// import folder_indicator from "./folder_indicator.svg";
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import { selectFolder } from '../../actions/folder';

// todo: Add Support for Mutli-Select
// const predefinedIcons = {
//   un_cate: '',
//   all: '',
//   un_tag: '',
//   all_tag: '',
//   trash: '',
//   folder: ''
// };
export type FolderType = {
  name: string,
  id: string,
  children: FolderType[]
};

type FolderItemProps = {
  id?: string,
  onFolderClick: (id: string) => void,
  level?: number,
  name: string,
  size?: number,
  subFolders?: FolderType[],
  select_folder_id?: string
};
class FolderItem extends Component<FolderItemProps> {
  constructor(props) {
    super(props);
    this.id = this.props.id || uuidv1();
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
    this.props.onFolderClick(this.id);
    this.setState({
      collpased: !this.state.collpased
    });
  }
  render() {
    const nameLeft = 40 + ((this.props.level || 0) * 14);
    const imgLeft = 16 + ((this.props.level || 0) * 14);
    let visibility = false;
    if (this.props.select_folder_id === this.id) {
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
            className="hover_indicator"
            style={{
              backgroundColor: 'rgba(119, 119, 119, 0.6)',
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
            }}
          >
            {this.props.name || 'All'}
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
            generateFolder(this.props.subFolders, (this.props.level || 0) + 1)
          }
        </div>
      </div>
    );
  }
}
const generateFolder = (subFolders?: FolderType[], level: number) => {
  if (subFolders == null || subFolders.length === 0) {
    return '';
  }
  // console.log(subFolders);
  return subFolders.map((item) => {

    return (
      <RFolderItem
        name={item.name}
        id={item.id}
        // size={item.size}
        key={item.id}
        level={level}
        subFolders={item.children}
      />
    );
  });
};
const mapStateToProps = (state) => {
  return {
    select_folder_id: state.selectFolder
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFolderClick: (id) => {
      dispatch(selectFolder(id));
    }
  };
};
const RFolderItem = connect(mapStateToProps, mapDispatchToProps)(FolderItem);
export default RFolderItem;
