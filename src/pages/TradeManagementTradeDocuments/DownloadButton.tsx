import React, { memo, useState, useRef } from 'react';
import { Button } from 'antd';

const DownloadButton = memo<any>(props => {
  const [href, setHref] = useState('');
  const btn = useRef<any>(null);
  const { downMethod, options } = props;

  const onClick = async () => {
    // 请求下载接口
    const res = await downMethod(options);

    // 下载
    setHref('wwww.baidu.com');
  };

  return (
    <Button type="default" onClick={onClick}>
      <a
        href={href}
        ref={node => {
          btn.current = node;
        }}
      >
        下载
      </a>
    </Button>
  );
});

export default DownloadButton;
