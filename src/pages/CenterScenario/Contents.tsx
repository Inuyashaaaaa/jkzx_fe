import React, { memo, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Form2 } from '@/containers';
import ThemeSelect from '@/containers/ThemeSelect';
import { IFormColDef } from '@/components/type';
import ThemeTable from '@/containers/ThemeTable';

const Contents = memo(props => {
  const [dataSource, setDataSource] = useState([]);

  const [tableColDefs, setTableColDefs] = useState([]);

  return <ThemeTable dataSource={dataSource} columns={tableColDefs}></ThemeTable>;
});

export default Contents;
