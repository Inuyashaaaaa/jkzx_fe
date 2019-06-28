import React, { memo, useState, useRef } from 'react';
import { Button, notification } from 'antd';
import uuidv4 from 'uuid/v4';
import { ButtonProps } from 'antd/lib/button';
import { DOWN_LOAD } from '@/services/document';

export interface BtnProps extends ButtonProps {
  url?: string; // 下载地址
  options?: string; // 接口参数
  name?: string; // 下载文件名称
}

const DownloadButton: React.SFC<BtnProps> = memo<BtnProps>(props => {
  const btn = useRef<any>(null);
  const { url, options, name, content, ...rest } = props;
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    const res = await DOWN_LOAD(url, options);
    setLoading(false);

    if (res.error) {
      return;
    }
    const a = document.createElement('a');
    a.href = res;
    a.download = name;
    a.innerText = '下载';
    const Id = uuidv4();
    a.id = Id;
    document.body.appendChild(a);
    document.getElementById(Id).click();
    document.getElementById(Id).remove();
  };

  return (
    <Button
      {...(rest || {})}
      loading={loading}
      onClick={onClick}
      ref={node => {
        btn.current = node;
      }}
    >
      {content}
    </Button>
  );
});

export default DownloadButton;
