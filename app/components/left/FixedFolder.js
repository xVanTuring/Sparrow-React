import React, { Component } from 'react';
import { connect } from 'react-redux';
import FolderItem from './FolderItem';
import { PRESET_FOLDER_ID } from '../center/Center';

type FixedFoldersProps = {
  counter: { [x: string]: number }
};
class FixedFolders extends Component<FixedFoldersProps> {
  render() {
    const { counter } = this.props;
    return (
      <div
        style={{
          marginTop: 12
        }}
      >
        <FolderItem name="All" size={counter[PRESET_FOLDER_ID[0]] || 0} id={PRESET_FOLDER_ID[0]} fixedFolder isOverLeft={false} />
        <FolderItem name="Un-Cate" size={0} id={PRESET_FOLDER_ID[1]} fixedFolder isOverLeft={false} />
        <FolderItem name="Un-Tag" size={0} id={PRESET_FOLDER_ID[2]} fixedFolder isOverLeft={false} />
        <FolderItem name="Trash" size={counter[PRESET_FOLDER_ID[3]] || 0} id={PRESET_FOLDER_ID[3]} fixedFolder isOverLeft />
      </div>
    );
  }
}
// export const calcSize = (id, images) => {
//   let filtered;
//   console.log('called');
//   switch (id) {
//     case PRESET_FOLDER_ID[0]:
//       return images.size;
//     case PRESET_FOLDER_ID[3]:
//       filtered = images.filter((item) => {
//         return item.isDeleted;
//       });
//       return filtered.size;
//     default:
//       filtered = images.filter((item) => {
//         // TODO:set by parent Level
//         return item.folders.includes(id);
//       });
//       return filtered.size;
//   }
// };

const mapStateToProps = (state) => (
  {
    // images: state.images
  }
);
export default connect(mapStateToProps)(FixedFolders);
