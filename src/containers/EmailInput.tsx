import { AutoComplete } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import { SelectValue } from 'antd/lib/select';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

interface IEmailInput extends AutoCompleteProps {
  emails?: string[];
  editing?: boolean;
}

const EmailInput = memo<IEmailInput>(props => {
  const emailsData = [
    '@qq.com',
    '@163.com',
    '@gmail.com',
    '@yahoo.com',
    '@sina.com',
    '@mail.com',
    '@fastmail.com',
    '@hostmail.com',
    '@126.com',
    '@cn-meiya.com',
    '@buynow.com',
  ];
  const { value, onChange, emails = emailsData, editing = true } = props;
  const getDataSource = () => {
    return value
      ? emails.map(item => {
          return `${value}${item}`;
        })
      : [];
  };

  if (!editing) {
    return value;
  }

  return (
    <AutoComplete
      onSelect={value => {
        onChange(value);
      }}
      dataSource={getDataSource()}
      {...props}
    />
  );
});

export default EmailInput;
