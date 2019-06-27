import React, { memo, useState, useRef } from 'react';
import { Button, notification } from 'antd';
import uuidv4 from 'uuid/v4';
import { DOWN_LOAD } from '@/services/document';

const DownloadButton = memo<any>(props => {
  const btn = useRef<any>(null);
  const { url, options, name } = props;
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
      type="default"
      loading={loading}
      onClick={onClick}
      ref={node => {
        btn.current = node;
      }}
    >
      下载
    </Button>
  );
});

export default DownloadButton;
