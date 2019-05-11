import React, { PureComponent, memo, useState } from 'react';
import DataTable from '@/containers/DataTable';
import { catchCallbackError } from '@/tools';
import { traTradeLCMNotificationSearch } from '@/services/trade-service';
import _ from 'lodash';
import { Form2 } from '@/design/components';
import {
  EVENT_TYPE_OPTIONS,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
} from '@/constants/common';

const ListTable = memo(props => {
  const [searchFormData, setSearchFormData] = useState({});

  return (
    <>
      <Form2
        columns={[
          {
            title: '事件类型',
            dataIndex: 'notificationEventType',
            input: {
              type: 'select',
              options: EVENT_TYPE_OPTIONS,
            },
          },
          {
            title: '事件日期',
            dataIndex: 'notificationTime',
            input: INPUT_NUMBER_DATE_CONFIG,
          },
          {
            title: '交易ID',
            dataIndex: 'tradeId',
          },
          {
            title: '持仓ID',
            dataIndex: 'positionId',
          },
          {
            title: '期权类型',
            dataIndex: 'productType',
            input: {
              type: 'select',
              options: PRODUCT_TYPE_OPTIONS,
            },
          },
          {
            title: '标的物',
            dataIndex: 'underlyerInstrumentId',
          },
          {
            title: '当前价格 (¥)',
            dataIndex: 'underlyerPrice',
            input: INPUT_NUMBER_DIGITAL_CONFIG,
          },
          {
            title: '障碍价 (¥)',
            dataIndex: 'barriers',
          },
          {
            title: '支付类型',
            dataIndex: 'paymentType',
          },
          {
            title: '支付金额 (¥)',
            dataIndex: 'payment',
            input: INPUT_NUMBER_DIGITAL_CONFIG,
          },
        ]}
        onFieldsChange={(props, fields) => {
          setSearchFormData({
            ...searchFormData,
            ...fields,
          });
        }}
      />
      <DataTable
        rowKey="notificationUUID"
        service={catchCallbackError(async () => {
          const { error, data } = await traTradeLCMNotificationSearch({
            after: searchFormData.date[0].format('YYYY-MM-DD'),
            before: searchFormData.date[1].format('YYYY-MM-DD'),
            notificationEventType: this.getNotificationEventType(
              searchFormData.notificationEventType
            ),
          });

          if (error) return [];

          return data.map(item => {
            const { eventInfo = {} } = item;
            let barriers;
            if (item.notificationEventType === 'KNOCK_OUT') {
              if (eventInfo.productType === 'DOUBLE_SHARK_FIN') {
                barriers = _.values(_.pick(eventInfo, ['lowBarrier', 'highBarrier'])).join('/');
              } else if (eventInfo.productType === 'BARRIER') {
                barriers = eventInfo.barrier;
              }
            }
            return {
              ...item,
              ...eventInfo,
              barriers,
            };
          });
        })}
      />
    </>
  );
});

export default ListTable;
