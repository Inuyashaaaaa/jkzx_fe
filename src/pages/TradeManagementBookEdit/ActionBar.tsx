import { PRICING_FROM_EDITING } from '@/constants/trade';
import { Affix, Button, Divider, Row } from 'antd';
import React, { memo, useState } from 'react';
import router from 'umi/router';
import './index.less';

const ActionBar = memo(() => {
  const [affixed, setAffixed] = useState(false);
  return (
    <Affix offsetBottom={20} onChange={affixed => setAffixed(affixed)}>
      <div style={{ background: '#fff', paddingBottom: affixed ? 30 : 0 }}>
        <Divider />
        <Row justify="end" type="flex">
          <Button
            type="primary"
            onClick={() => {
              router.push({
                pathname: '/trade-management/pricing',
                query: {
                  from: PRICING_FROM_EDITING,
                },
              });
            }}
          >
            转换定价
          </Button>
        </Row>
      </div>
    </Affix>
  );
});

export default ActionBar;
