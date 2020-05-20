import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Skeleton, Card } from 'antd';

import { StateType } from '@/pages/document/cms/model';
import { Dispatch } from '@@/plugin-dva/connect';
import { AnyAction, connect } from 'umi';

import Play from '../play';

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
  match: {
    params: {
      [key: string]: string;
    };
  };
}

interface Lesson {
  id: number;
  duration: number;
  title: number;
  orders: number;
  props: {
    [key: string]: any;
  };
}

interface IndexState {
  playModalVisible: boolean;
  values: {
    title?: string;
    aid?: number;
    bid?: string;
    lessons?: Lesson[];
  };
  lesson: Lesson;
}

class Index extends Component<IndexProps, IndexState> {
  state: IndexState = {
    playModalVisible: false,
    values: {},
  };

  componentDidMount(): void {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    dispatch({
      type: 'course/detail',
      payload: params,
      callback: (response: { title: string; aid: number; bid: string; lessons: Lesson[] }) => {
        this.setState({
          values: response,
        });
      },
    });
  }

  play = (record: Lesson) => {
    const { dispatch } = this.props;
    this.setState({
      playModalVisible: true,
      lesson: record,
    });

    dispatch({
      type: 'course/downloadHits',
      payload: {
        id: record.id,
      },
    });
  };

  close = () => {
    this.setState({
      playModalVisible: false,
    });
  };

  render() {
    const { loading } = this.props;
    const { values, playModalVisible, lesson } = this.state;
    const { title, lessons = [], aid } = values;
    return (
      <PageHeaderWrapper style={{ minHeight: '80%' }} title={false}>
        <Card bordered={false} title={title} className={styles.lessons}>
          <Skeleton loading={loading}>
            <Row gutter={16}>
              {lessons.map((item, index: number) => (
                <Col
                  onClick={() => this.play(item)}
                  key={item.id}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  md={{ span: 12 }}
                  sm={{ span: 24 }}
                  xs={{ span: 24 }}
                >
                  <div className={styles.lessonItem}>
                    {index + 1}. {item.title}
                  </div>
                </Col>
              ))}
            </Row>
          </Skeleton>
        </Card>
        {playModalVisible && Object.keys(lesson).length > 0 ? (
          <Play aid={aid} close={this.close} lesson={lesson} playModalVisible={playModalVisible} />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ course, loading }: ConnectState) => ({
  course,
  loading: loading.effects['course/detail'],
}))(Index);
