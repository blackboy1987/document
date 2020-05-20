import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { history, ConnectProps, connect, Link } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';

import defaultAvatar from '@/assets/3.png';

import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      currentUser = {
        avatar: '',
        username: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.avatar || defaultAvatar}
            alt="avatar"
          />
          <span className={styles.name}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span>
        <Link to="/user/login">登录</Link>
        <Divider type="vertical" />
        <Link to="/user/register">注册</Link>
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
