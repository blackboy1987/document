import React from "react";
import PayInfo from "@/pages/components/payInfo";
import QrCode from "@/pages/components/qrcode";
import {Col, message, Modal, Row} from "antd";
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';

interface DownloadProps {
  title:string;
  downloadModalVisible:boolean;
  item:string[];
  close:(downloadModalVisible:boolean)=>void;
}

const Index: React.FC<DownloadProps> = ({ title,downloadModalVisible,item,close }) => (
  <Modal
    onCancel={() => close(false)}
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
);


export default Index;
