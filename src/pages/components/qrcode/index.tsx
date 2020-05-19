import React from 'react';

import { Tabs } from 'antd';
import styles from './style.less';

import qrCode from './images/qrcode.png';

const QrCode = () => (
  <Tabs>
    <Tabs.TabPane tab="公众号" key="qrCode">
      <img alt="" className={styles.qrCode} src={qrCode} />
    </Tabs.TabPane>
  </Tabs>
);

export default QrCode;
