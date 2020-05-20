import React, { FC } from 'react';
import { Modal } from 'antd';

const playUrl = 'https://player.bilibili.com/player.html';

interface PlayProps {
  playModalVisible: boolean;
  close: () => void;
  lesson: {
    title: string;
    props: {
      [key: string]: any;
    };
  };
  aid: number;
}

const Index: FC<PlayProps> = ({ playModalVisible, close, lesson, aid }) => (
  <Modal
    title={lesson.title}
    visible={playModalVisible}
    width="80%"
    style={{ top: 0 }}
    footer={null}
    onCancel={close}
    destroyOnClose
    maskClosable={false}
  >
    <div style={{ position: 'relative', padding: '30% 45%' }}>
      <iframe
        title="navigation"
        style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}
        src={`${playUrl}?cid=${lesson.props.cid}&aid=${aid}&page=${lesson.props.orders}&as_wide=1&high_quality=1&danmaku=0`}
        frameBorder="no"
        scrolling="no"
      />
    </div>
  </Modal>
);

export default Index;
