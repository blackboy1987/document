import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import {Col, List, message, Modal, Row, Skeleton, Tabs, Typography} from 'antd';
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';
import {DownloadOutlined} from '@ant-design/icons';
import {StateType} from '@/pages/cms/model';
import {Dispatch} from '@@/plugin-dva/connect';
// @ts-ignore
import {AnyAction} from 'umi';
import {ResourceItem, ResourceListItem} from '@/pages/document/data';
import PayInfo from '@/pages/components/payInfo';
import QrCode from '@/pages/components/qrcode';
import moment from 'moment';
import styles from './index.less';
import SearchBar from '@/pages/document/components/SearchBar';

interface ConnectState {
  resource: StateType;
  book: StateType;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}

interface IndexProps {
  // @ts-ignore
  dispatch: Dispatch<AnyAction>;
  resource: StateType;
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
      type: 'book/list',
      payload: {
        id: 10,
      },
      callback: (response: ResourceListItem[]) => {
        this.setState({
          allResources: response ||[],
          filterResources: response ||[],
        });
      },
    });
  }

  download = (item: ResourceItem) => {
    const root = this;
    const { allResources, filterResources } = this.state;
    const { dispatch } = root.props;
    dispatch({
      type: 'resource/download',
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
      type: 'resource/downloadHits',
      payload: {
        id: item.id,
      },
      callback: (response: { [key: string]: any }) => {
        this.setState({
          allResources: allResources.map((item1) => ({
            ...item1,
            items: item1.items.map((resource) => {
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
            items: item1.items.map((resource) => {
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

  handleFormSubmit=(filterResources:ResourceListItem[])=>{
    this.setState({
      filterResources,
    })
  };

  render() {
    const {loading} = this.props;
    const { downloadModalVisible, item = [], title, filterResources = [],allResources } = this.state;
    return (
      <PageHeaderWrapper style={{ minHeight: '80%' }} title={false}>
        <div style={{ marginBottom: 24 }}>
          <SearchBar originData={allResources||[]} handleFormSubmit={this.handleFormSubmit} />
        </div>
        <Row gutter={16}>
          <Col span={16} offset={4}>
            <Skeleton loading={loading}>
              <Tabs tabPosition="left" className={styles.tabs}>
              {filterResources.map((item1: ResourceListItem) => (
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
                    renderItem={(resource) => (
                      <List.Item
                        key={resource.id}
                        actions={[
                          <a onClick={() => this.download(resource)}>
                            <DownloadOutlined style={{ fontSize: 18 }} />
                          </a>,
                        ]}
                      >
                        <Skeleton loading={false} title={false}>
                          <List.Item.Meta
                            title={
                              <Typography.Paragraph style={{ marginBottom: 0 }} ellipsis>
                                {resource.name}
                              </Typography.Paragraph>
                            }
                            description={
                              <>
                                <div>
                                  发布时间：{moment(resource.createDate).format('YYYY-MM-DD')}
                                </div>
                                <div>下载次数：{resource.downloadHits}</div>
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
        <Modal
          onCancel={() => this.setState({ downloadModalVisible: false })}
          title={`${title} 资源下载`}
          visible={downloadModalVisible}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ width: 270 }}>
              <PayInfo />
              <p
                style={{
                  width: 200,
                  textAlign: 'center',
                  color: '#fff',
                  backgroundColor: '#1890ff',
                  marginTop: 16,
                  padding: 8,
                  fontSize: 18,
                }}
              >
                支持一下作者呗
              </p>
            </div>
            <div>
              <QrCode />
              <p
                style={{
                  width: 200,
                  textAlign: 'center',
                  color: '#fff',
                  backgroundColor: '#1890ff',
                  marginTop: 16,
                  padding: 8,
                  fontSize: 18,
                }}
              >
                喜欢就加入我们吧
              </p>
            </div>
          </div>
          <Row gutter={16}>
            {item.map((item1, index) => (
              <Col span={8} key={index}>
                <CopyToClipboard
                  text={item1}
                  onCopy={() => {
                    message.destroy();
                    message.success('复制成功！！！');
                  }}
                >
                  <a title={`下载地址${index + 1}`}>下载地址{index + 1}</a>
                </CopyToClipboard>
              </Col>
            ))}
          </Row>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ resource, book, loading }: ConnectState) => ({
  resource,
  book,
  loading: loading.effects['book/list'],
}))(Index);
