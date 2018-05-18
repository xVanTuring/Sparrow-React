import React, { Component } from 'react';
import { Input, Tag, Popover, Icon } from 'antd';
import AlphabetList from 'react-alphabet-list';
import STag from './STag';

type TagAreaProps = {
  tags: [],
  onCreateTag: (id: string) => void
};
class TagArea extends Component<TagAreaProps> {
  constructor(props) {
    super(props);
    this.state = {
      searchContent: ''
    };
  }
  render() {
    const { tags, onCreateTag } = this.props;
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
            }}
          >
            <Input.Search
              placeholder="Search yours tags"
              onPressEnter={() => {
                if (!(filteredTags.length > 0 && filteredTags.indexOf(searchContent) > -1)) {
                  onCreateTag(searchContent);
                }
              }}
              value={searchContent}
              onChange={(e) => {
                this.setState({
                  searchContent: e.target.value
                });
              }}
            />
            <div
              style={{
                marginTop: 12
              }}
            >
              <AlphabetList
                style={{
                  width: 300,
                  height: 360
                }}
                data={filteredTags}
                generateFn={
                  (item, index) => {
                    return (
                      <Tag
                        color={item === 'city' ? '#2db7f5' : 'rgb(42, 42, 42)'}
                        key={item + index}
                      >
                        <Icon type={item === 'city' ? 'check' : 'plus'} style={{ margin: '0 4px 0 0' }} />
                        {item}
                      </Tag>
                    );
                  }
                }
              />
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
            overflowX: 'hidden'
          }}
        >
          <STag color="#2db7f5" value="Night" type="1" />
          <STag color="#2db7f5" value="Lake" type="1" />
          <STag color="#2db7f5" value="Temp" type="1" />
          <STag color="#2db7f5" value="City" type="1" />
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
export default TagArea;
