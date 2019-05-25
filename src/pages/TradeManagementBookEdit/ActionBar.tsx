import { PRICING_FROM_EDITING } from '@/constants/trade';
import { Affix, Button, Divider, Row } from 'antd';
import React, { memo, useState } from 'react';
import router from 'umi/router';
import './index.less';
import { Form2 } from '@/containers';
import { LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import { ITableData } from '@/components/type';

const ActionBar = memo<{
  tableData?: ITableData[];
}>(props => {
  const { tableData = [] } = props;
  const [affixed, setAffixed] = useState(false);
  const getDisabled = () => {
    const result = tableData.every(record => {
      const legType = Form2.getFieldValue(record[LEG_TYPE_FIELD]);
      return legType === LEG_TYPE_MAP.MODEL_XY;
    });
    return result;
  };
  return (
    <Affix offsetBottom={20} onChange={affixed => setAffixed(affixed)}>
      <div style={{ background: '#fff', paddingBottom: affixed ? 30 : 0 }}>
        <Divider />
        <Row justify="end" type="flex">
          <Button
            disabled={getDisabled()}
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
