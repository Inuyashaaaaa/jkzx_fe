import React from 'react';
import { ToolStructureDefs } from './constants';
import { getOtcAssetToolReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场资产和工具结构"
      fetchMethod={getOtcAssetToolReport}
      columns={ToolStructureDefs}
      scrollWidth={{ x: 1290 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
