import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Table2, Select, Form2, Input } from '@/containers';
import { Card, Icon, Popover, Col, Modal } from 'antd';
import styles from './index.less';

const PopconfirmCard = props => {
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <>
      <Popover content={content} title="Title" trigger="click">
        <Icon type="info-circle" />
      </Popover>
    </>
  );
};

export default PopconfirmCard;
