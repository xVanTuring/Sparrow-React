import React, { Component } from 'react';
import { Set } from 'immutable';
import { connect } from 'react-redux';
import { Input, Popover, } from 'antd';
import AlphabetList from 'react-alphabet-list';
import STag from './STag';
// TODO: add pin icon
// TODO: search existed tag click to add to img
const { ipcRenderer } = require('electron');

type TagAreaProps = {
  currentId: string | string[],
  tags: Set,
  currentTags: string[]
};
class TagArea extends Component<TagAreaProps> {
  constructor(props) {
    super(props);
    this.state = {
      searchContent: '',
      opened: false
    };
    this.filteredTags = null;
  }
  handleTagClick = (tag, type) => {
    if (type === 'add') {
      if (this.props.currentId instanceof Array) {
        ipcRenderer.send('addImagesTag', [this.props.currentId, tag]);
      } else {
        ipcRenderer.send('addImagesTag', [[this.props.currentId], tag]);
      }
    } else {
      this.handleOnClose(tag);
    }
  }
  handleOnClose = (tag) => {
    if (this.props.currentId instanceof Array) {
      ipcRenderer.send('deleteImagesTag', [this.props.currentId, tag]);
    } else {
      ipcRenderer.send('deleteImagesTag', [[this.props.currentId], tag]);
    }
  }
  handleVisibleChange = (visible) => {
    this.setState({
      opened: visible
    });
  }
  handleInputChange = (e) => {
    this.setState({
      searchContent: e.target.value
    });
  }
  handleEnterPress = () => {
    if (!(this.filteredTags.size > 0 && this.filteredTags.contains(this.state.searchContent))) {
      this.handleTagClick(this.state.searchContent, 'add');
    }
  }
  handleInputKeyDown = (e) => {
    console.log(e.keyCode);
  }
  render() {
    const {
      tags,
      currentTags
    } = this.props;
    const {
      opened
    } = this.state;
    const { searchContent } = this.state;
    const filteredTags = tagFilter(searchContent, tags);
    this.filteredTags = filteredTags;
    return (
      <Popover
        style={{
          backgroundColor: '#333'
        }}
        onVisibleChange={this.handleVisibleChange}
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
              autoFocus
              placeholder="Search yours tags"
              onPressEnter={this.handleEnterPress}
              value={searchContent}
              onChange={this.handleInputChange}
              onKeyDown={this.handleInputKeyDown}
            />
            <div
              style={{
                marginTop: 12
              }}
            >
              {
                filteredTags.size > 0 ? (
                  <AlphabetList
                    style={{
                      width: 300,
                      height: 380
                    }}
                    data={filteredTags}
                    generateFn={
                      (item, index) => {
                        if (currentTags.indexOf(item) >= 0) {
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
            color: '#BFBFBF',
            fontSize: '12px',
            border: `1px solid ${opened ? '#0988ff' : 'transparent'}`,
            // boxSizing: 'border-box'
          }}
        >
          {
            currentTags.length > 0 ?
              currentTags.map((item) => (
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
const tagFilter = (key: string, tags: Set) => {
  if (key === '') {
    return tags;
  }
  return tags.filter((item) => (item.indexOf(key) >= 0));
};
const mapStateToProps = (state) => (
  {
    tags: state.tags
  }
);
export default connect(mapStateToProps)(TagArea);

