import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Table2, Select, Form2, Input } from '@/containers';
import { Card, Icon, Popover, Col, Modal } from 'antd';
import styles from './index.less';
import { operation, symbol, OPERATION_MAP } from './constants';

const PopconfirmCard = props => {
  const { data } = props;

  const content = (
    <div>
      <ul className={styles.desList}>
        {data.description &&
          data.description.split(',').length > 0 &&
          data.description.split(',').map((des, index) => {
            return <li key={index}>{des}</li>;
          })}
      </ul>
    </div>
  );

  return (
    <>
      <Popover placement="right" content={content}>
        <Icon type="info-circle" style={{ margin: '0 5px' }} />
      </Popover>
    </>
  );
};

export default PopconfirmCard;
