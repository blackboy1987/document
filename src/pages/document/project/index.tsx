import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List, Typography, Row, Col, Skeleton, Tabs, Card } from 'antd';

import { DownloadOutlined } from '@ant-design/icons';
import { StateType } from '@/pages/document/cms/model';
import { Dispatch } from '@@/plugin-dva/connect';
import { AnyAction, connect } from 'umi';
import { ResourceItem, ResourceListItem } from '@/pages/document/data';
import moment from 'moment';
import SearchBar from '@/pages/document/components/SearchBar';

import Download from '@/pages/document/components/Download';
import styles from './index.less';

interface ConnectState {
  project: StateType;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}

interface IndexProps {
  // @ts-ignore
  dispatch: Dispatch<AnyAction>;
  project: StateType;
  loading?: boolean;
}

interface IndexState {
  downloadModalVisible: boolean;
  title: string;
  item: string[];
  allProjects: ResourceListItem[];
  filterProjects: ResourceListItem[];
}

class Index extends Component<IndexProps, IndexState> {
  state: IndexState = {
    downloadModalVisible: false,
    title: '',
    item: [],
    allProjects: [],
    filterProjects: [],
  };

  componentDidMount(): void {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/list',
      callback: (response: ResourceListItem[]) => {
        this.setState({
          allProjects: response,
          filterProjects: response,
        });
      },
    });
  }

  handleFormSubmit = (filterProjects: ResourceListItem[]) => {
    this.setState({
      filterProjects,
    });
  };

  download = (item: ResourceItem) => {
    const root = this;
    const { allProjects, filterProjects } = this.state;
    const { dispatch } = root.props;
    dispatch({
      type: 'project/download',
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
      type: 'project/downloadHits',
      payload: {
        id: item.id,
      },
      callback: (response: { [key: string]: any }) => {
        this.setState({
          allProjects: allProjects.map((item1) => ({
            ...item1,
            items: item1.items.map((project: ResourceItem) => {
              if (project.id === item.id) {
                return {
                  ...project,
                  downloadHits: response.downloadHits,
                };
              }
              return {
                ...project,
              };
            }),
          })),
          filterProjects: filterProjects.map((item1) => ({
            ...item1,
            items: item1.items.map((project: ResourceItem) => {
              if (project.id === item.id) {
                return {
                  ...project,
                  downloadHits: response.downloadHits,
                };
              }
              return {
                ...project,
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
    const { downloadModalVisible, item = [], title, filterProjects = [], allProjects } = this.state;
    return (
      <PageHeaderWrapper style={{ minHeight: '80%' }} title={false}>
        <Card bordered={false} size="small">
          <div style={{ marginBottom: 24 }}>
            <SearchBar originData={allProjects || []} handleFormSubmit={this.handleFormSubmit} />
          </div>
          <Row gutter={16}>
            <Col span={24}>
              <Skeleton loading={loading}>
                <Tabs tabPosition="left" className={styles.tabs}>
                  {(filterProjects || []).map((item1: ResourceListItem) => (
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
                        renderItem={(project: ResourceItem) => (
                          <List.Item
                            key={project.id}
                            actions={[
                              <a onClick={() => this.download(project)}>
                                <DownloadOutlined style={{ fontSize: 18 }} />
                              </a>,
                            ]}
                          >
                            <Skeleton loading={false} title={false}>
                              <List.Item.Meta
                                title={
                                  <Typography.Paragraph style={{ marginBottom: 0 }} ellipsis>
                                    {project.name}
                                  </Typography.Paragraph>
                                }
                                description={
                                  <>
                                    <div>
                                      发布时间：{moment(project.createDate).format('YYYY-MM-DD')}
                                    </div>
                                    <div>下载次数：{project.downloadHits}</div>
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

export default connect(({ project, loading }: ConnectState) => ({
  project,
  loading: loading.effects['project/list'],
}))(Index);
