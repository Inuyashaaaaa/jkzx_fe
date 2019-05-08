import { VERTICAL_GUTTER } from '@/constants/global';
import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import { Form2 } from '@/design/components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptPositionReportSearchPaged, rptReportNameList } from '@/services/report-service';
import { getMoment } from '@/utils';
import { ConfigProvider, Divider, message, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { Modal } from '@/states/report';
const ReportsEodPosition = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'LIVE_POSITION_INFO'}
      searchMethod={rptPositionReportSearchPaged}
      downloadName={'持仓明细'}
      scrollWidth={3320}
    />
  );
});

export default ReportsEodPosition;
