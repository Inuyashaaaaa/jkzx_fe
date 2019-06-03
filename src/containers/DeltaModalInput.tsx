import React, { memo, useState } from 'react';
import { Modal, Row, Col, Descriptions } from 'antd';
import {
  LEG_ENV,
  GENERAL_COMPUTED_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
  TOTAL_EDITING_FIELDS,
  TOTAL_COMPUTED_FIELDS,
} from '@/constants/legs';
import _ from 'lodash';
import { Form2 } from '@/containers';

const Import4 = memo(props => {
  const totalComputedFields = [
    'DELTA',
    'DELTA_CASH',
    'GAMMA',
    'GAMMA_CASH',
    'STD_DELTA',
    'THETA',
    'VEGA',
    'RHO_R',
    'CEGA',
  ];
  const { visible, value, onChange, onValueChange, hideModal } = props;
  const handleItem = () => {
    const computedItem = _.reduce(
      Form2.getFieldsValue(_.pick(value, totalComputedFields)),
      (total, value, key) => {
        if (_.isNumber(value)) {
          return {
            ...total,
            [key]: value,
          };
        }
        if (_.isObjectLike(value)) {
          return {
            ...total,
            ...value,
          };
        }
      },
      {}
    );
    return _.map(computedItem, (value, key) => {
      return (
        <Descriptions.Item label={key} key={key}>
          {value}
        </Descriptions.Item>
      );
    });
  };

  return (
    <Modal
      visible={visible}
      footer={false}
      onCancel={() => {
        hideModal();
      }}
    >
      <Descriptions column={2}>{handleItem()}</Descriptions>
    </Modal>
  );
});

export default Import4;
