import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { formatNumber } from '@/tools';

const GradientBox = props => {
  const [value, setValue] = useState(null);
  const [width, setWidth] = useState(10);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setWidth(_.floor((props.value / props.max) * 100));
  }, [props.max, props.value]);

  const handleStyle = widthData => ({
    background: 'linear-gradient(90deg, #216296, #4F8FBA, #87C3E4)',
    width: widthData,
    height: '100%',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: 100,
          marginRight: 20,
        }}
      >
        <div style={handleStyle(width)}></div>
      </div>
      <div>{formatNumber(value * 100, 2)}</div>
    </div>
  );
};

export default GradientBox;
