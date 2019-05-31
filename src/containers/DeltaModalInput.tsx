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
  const handleItem = Form2.getFieldsValue(_.pick(value, totalComputedFields));

  return (
    <Modal
      visible={visible}
      footer={false}
      onCancel={() => {
        hideModal();
      }}
    >
      <div>fadfadjgioa</div>
    </Modal>
  );
});

export default Import4;
