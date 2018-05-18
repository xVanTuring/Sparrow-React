import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Popover, } from 'antd';
import AlphabetList from 'react-alphabet-list';
import STag from './STag';

const { ipcRenderer } = require('electron');

type TagAreaProps = {
  currentId: string,
  tags: [],
  imgTags: string[]

};
class TagArea extends Component<TagAreaProps> {
  constructor(props) {
    super(props);
    this.state = {
      searchContent: ''
    };
    this.focused = false;
  }
  handleTagClick = (tag, type) => {
    if (type === 'add') {
      ipcRenderer.send('addTag', [this.props.currentId, tag]);
    } else {
      this.handleOnClose(tag);
    }
  }
  handleOnClose = (value) => {
    ipcRenderer.send('removeTag', [this.props.currentId, value]);
  }
  render() {
    const {
      tags,
      imgTags
    } = this.props;
    const { searchContent } = this.state;
    const filteredTags = tagFilter(searchContent, tags);
    return (
      <Popover
        style={{
          backgroundColor: '#333'
        }}
        placement="left"
        trigger="click"
        title={
          <div
            style={{
              textAlign: 'center'
            }}
          >
            Tags
          </div>
        }
        content={
          <div
            style={{
              padding: '0px 4px',
              width: 300,
              minHeight: 420,
            }}
          >
            <Input.Search
              placeholder="Search yours tags"
              onPressEnter={() => {
                if (!(filteredTags.length > 0 && filteredTags.indexOf(searchContent) > -1)) {
                  this.handleTagClick(searchContent, 'add');
                }
              }}
              value={searchContent}
              onChange={(e) => {
                this.setState({
                  searchContent: e.target.value
                });
              }}
              ref={ref => {
                if (ref && !this.focused) {
                  ref.focus();
                  this.focused = true;
                }
              }}
            />
            <div
              style={{
                marginTop: 12
              }}
            >
              {
                filteredTags.length > 0 ? (
                  <AlphabetList
                    style={{
                      width: 300,
                      height: 360
                    }}
                    data={filteredTags}
                    generateFn={
                      (item, index) => {
                        if (imgTags.indexOf(item) >= 0) {
                          return (
                            <STag key={item + index} value={item} type="3" onClick={this.handleTagClick} />
                          );
                        }
                        return (
                          <STag key={item + index} value={item} type="2" onClick={this.handleTagClick} />
                        );
                      }
                    }
                  />
                ) :
                  (

                    <div
                      style={{
                        color: 'white',
                        textAlign: 'center'
                      }}
                    >
                      {
                        searchContent !== '' ? 'Press Enter to Create tag' : 'Type tag to create'
                      }
                    </div>
                  )
              }

            </div>
          </div>
        }
      >
        <div
          style={{
            marginTop: 16,
            backgroundColor: '#333',
            height: 90,
            padding: 8,
            cursor: 'text',
            borderRadius: '4px',
            overflow: 'scroll',
            overflowX: 'hidden',
            color: 'white',
            fontSize: 12
          }}
        >
          {
            imgTags.length > 0 ?
              imgTags.map((item) => (
                <STag key={item} color="#2db7f5" value={item} type="1" onClose={this.handleOnClose} />
              ))
              :
              'Click To Add Tag'
          }
        </div>
      </Popover>
    );
  }
}
const tagFilter = (key: string, tags: string[]) => {
  if (key === '') {
    return tags;
  }
  return tags.filter((item) => {
    return item.indexOf(key) >= 0;
  });
};
const mapStateToProps = (state) => (
  {
    tags: state.tags
  }
);
export default connect(mapStateToProps)(TagArea);
