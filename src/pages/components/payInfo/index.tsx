import React from 'react';
import { Tabs } from 'antd';

import styles from './style.less';

import alipay from './images/alipay.png';
import qq from './images/qq.png';
import wechat from './images/wechat.png';

const PayInfo = () => (
  <Tabs>
    <Tabs.TabPane tab="支付宝" key="alipay">
      <img alt="" className={styles.payImage} src={alipay} />
    </Tabs.TabPane>
    <Tabs.TabPane tab="QQ钱包" key="qq">
      <img alt="" className={styles.payImage} src={qq} />
    </Tabs.TabPane>
    <Tabs.TabPane tab="微信支付" key="wechat">
      <img alt="" className={styles.payImage} src={wechat} />
    </Tabs.TabPane>
  </Tabs>
);

export default PayInfo;
