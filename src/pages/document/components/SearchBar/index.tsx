import React, { Component } from 'react';
import { Input } from 'antd';
import { ResourceListItem } from '@/pages/document/data';

interface IndexProps {
  originData: ResourceListItem[];
  handleFormSubmit: (filterResources: ResourceListItem[]) => void;
}

class Index extends Component<IndexProps> {
  handleFormSubmit = (value: string) => {
    const { originData = [], handleFormSubmit } = this.props;
    const filterResources = originData
      .map((item) => {
        return {
          ...item,
          items: item.items.filter(
            (resource) =>
              (resource.name || resource.title)
                .toLocaleLowerCase()
                .indexOf(value.toLocaleLowerCase()) >= 0,
          ),
        };
      })
      .filter((item) => item.items.length > 0);

    handleFormSubmit(filterResources);
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28 }}>爱尚学院资源查询系统</h1>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ maxWidth: 522, width: '100%' }}
        />
      </div>
    );
  }
}

export default Index;
