import React from 'react';

import styles from './style.less';

import qrCode from './images/qrcode.png';
import { Tabs } from 'antd';

const QrCode = () => (
  <Tabs>
    <Tabs.TabPane tab="公众号" key="qrCode">
      <img alt="" className={styles.qrCode} src={qrCode} />
    </Tabs.TabPane>
  </Tabs>
);

export default QrCode;
