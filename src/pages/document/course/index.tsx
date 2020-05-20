import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List, Typography, Row, Col, Skeleton, Tabs, Card } from 'antd';

import { VideoCameraOutlined } from '@ant-design/icons';
import { StateType } from '@/pages/document/cms/model';
import { Dispatch } from '@@/plugin-dva/connect';
import { AnyAction, connect, Link } from 'umi';
import { ResourceItem, ResourceListItem } from '@/pages/document/data';
import moment from 'moment';
import SearchBar from '@/pages/document/components/SearchBar';

import Download from '@/pages/document/components/Download';
import styles from './index.less';

interface ConnectState {
  course: StateType;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}

interface IndexProps {
  // @ts-ignore
  dispatch: Dispatch<AnyAction>;
  course: StateType;
  loading?: boolean;
}

interface IndexState {
  downloadModalVisible: boolean;
  title: string;
  item: string[];
  allResources: ResourceListItem[];
  filterResources: ResourceListItem[];
}

class Index extends Component<IndexProps, IndexState> {
  state: IndexState = {
    downloadModalVisible: false,
    title: '',
    item: [],
    allResources: [],
    filterResources: [],
  };

  componentDidMount(): void {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/list',
      callback: (response: ResourceListItem[]) => {
        this.setState({
          allResources: response,
          filterResources: response,
        });
      },
    });
  }

  handleFormSubmit = (filterResources: ResourceListItem[]) => {
    this.setState({
      filterResources,
    });
  };

  download = (item: ResourceItem) => {
    const root = this;
    const { allResources, filterResources } = this.state;
    const { dispatch } = root.props;
    dispatch({
      type: 'course/download',
      payload: {
        id: item.id,
      },
      callback: (response: string[]) => {
        this.setState({
          downloadModalVisible: true,
          item: response,
          title: item.name,
        });
      },
    });
    dispatch({
      type: 'course/downloadHits',
      payload: {
        id: item.id,
      },
      callback: (response: { [key: string]: any }) => {
        this.setState({
          allResources: allResources.map((item1) => ({
            ...item1,
            items: item1.items.map((resource: ResourceItem) => {
              if (resource.id === item.id) {
                return {
                  ...resource,
                  downloadHits: response.downloadHits,
                };
              }
              return {
                ...resource,
              };
            }),
          })),
          filterResources: filterResources.map((item1) => ({
            ...item1,
            items: item1.items.map((resource: ResourceItem) => {
              if (resource.id === item.id) {
                return {
                  ...resource,
                  downloadHits: response.downloadHits,
                };
              }
              return {
                ...resource,
              };
            }),
          })),
        });
      },
    });
  };

  close = () => {
    this.setState({
      downloadModalVisible: false,
    });
  };

  render() {
    const { loading } = this.props;
    const {
      downloadModalVisible,
      item = [],
      title,
      filterResources = [],
      allResources,
    } = this.state;
    return (
      <PageHeaderWrapper style={{ minHeight: '80%' }} title={false}>
        <Card bordered={false} size="small">
          <div style={{ marginBottom: 24 }}>
            <SearchBar originData={allResources || []} handleFormSubmit={this.handleFormSubmit} />
          </div>
          <Row gutter={16}>
            <Col span={24}>
              <Skeleton loading={loading}>
                <Tabs tabPosition="left" className={styles.tabs}>
                  {(filterResources || []).map((item1: ResourceListItem) => (
                    <Tabs.TabPane
                      tab={
                        <h4>
                          {item1.name}({item1.items.length})
                        </h4>
                      }
                      key={`${item1.id}`}
                    >
                      <List
                        bordered
                        pagination={false}
                        dataSource={item1.items}
                        renderItem={(resource: ResourceItem) => (
                          <List.Item
                            key={resource.id}
                            actions={[
                              <Link to={`/course/list/${resource.id}`}>
                                <VideoCameraOutlined style={{ fontSize: 18 }} />
                              </Link>,
                            ]}
                          >
                            <Skeleton loading={false} title={false}>
                              <List.Item.Meta
                                title={
                                  <Typography.Paragraph style={{ marginBottom: 0 }} ellipsis>
                                    {resource.name || resource.title}
                                  </Typography.Paragraph>
                                }
                                description={
                                  <>
                                    <div>
                                      发布时间：{moment(resource.createDate).format('YYYY-MM-DD')}
                                    </div>
                                  </>
                                }
                              />
                            </Skeleton>
                          </List.Item>
                        )}
                      />
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </Skeleton>
            </Col>
          </Row>
          <Download
            downloadModalVisible={downloadModalVisible}
            item={item}
            title={title}
            close={this.close}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ course, loading }: ConnectState) => ({
  course,
  loading: loading.effects['course/list'],
}))(Index);
