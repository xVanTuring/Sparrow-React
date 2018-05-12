import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import FolderItem, { FolderType } from './FolderItem';

type Prop = {
  folders?: List<FolderType>,
  isOverLeft: boolean,
  counter: { [x: string]: number }
};

class Folders extends Component<Prop> {
  render() {
    const { folders, counter } = this.props;
    return (
      <div
        style={{
          marginTop: 8
        }}
      >
        {
          folders.map((item) => (
            <FolderItem
              name={item.name}
              id={item.id}
              key={item.id}
              subFolders={item.children}
              isOverLeft={this.props.isOverLeft}
              size={counter[item.id] || 0}
            />
          ))
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  folders: state.folders,
});


export default connect(mapStateToProps)(Folders);
