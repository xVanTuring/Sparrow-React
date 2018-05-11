import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import FolderItem, { FolderType } from './FolderItem';

type Prop = {
  folders?: List<FolderType>
};

class Folders extends Component<Prop> {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    return (
      <div
        style={{
          marginTop: 8
        }}
      >
        {
          this.props.folders.map((item) => (
            <FolderItem name={item.name} id={item.id} key={item.id} subFolders={item.children} />
          ))
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  folders: state.folders
});
const mapDispatchToProps = (dispatch) => (
  {
    // onFolderClick: (id) => {
    //   // dispatch(selectFolder(id));
    // }
  });

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
