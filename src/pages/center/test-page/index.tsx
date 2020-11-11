import { GutterEnums } from '@/constants';
import { DownloadExcelButton, ThemeButton, ThemeInput, ThemeTable } from '@/components';
import RiskControlIndexReportModelInstance, {
  RiskControlIndexReportModel,
} from '@/pages/center/test-page/models/table';
import { ModelNameSpaces, RootStore } from '@/types';
import { Col, Row } from 'antd';
import { TableProps } from 'antd/lib/table';
import { connect } from 'dva';
import utl from 'lodash';
import React, { memo, useEffect } from 'react';
import { Dispatch } from 'redux';
import { MainTableColumnsList } from '@/pages/center/test-page/constants';
import { PaginationConfig } from 'antd/lib/pagination';

type RiskControlIndexReportProps = {} & {
  dispatch: Dispatch<any>;
} & Pick<RiskControlIndexReportModel, 'traderTableData' | 'pagination' | 'total' | 'searchData'> & {
    searchLoading: boolean;
  };

const RiskControlIndexReport = memo<RiskControlIndexReportProps>(
  connect((store) => {
    const { [ModelNameSpaces.RiskControlIndexReportModel]: model, loading } = store as RootStore;
    return {
      ...utl.pick(model, ['traderTableData', 'pagination', 'total', 'searchData']),
      searchLoading:
        loading.effects[`${ModelNameSpaces.RiskControlIndexReportModel}/fetchTableData`],
    };
  })((props: RiskControlIndexReportProps) => {
    const { dispatch, pagination, searchLoading, total, traderTableData, searchData } = props;

    const handleTableChange: TableProps<any>['onChange'] = (_pagination: PaginationConfig) => {
      dispatch(
        RiskControlIndexReportModelInstance.actions.setTableMeta({
          pagination: _pagination,
        }),
      );
    };

    const handleSearch = () => {
      triggerFetchTableData();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(RiskControlIndexReportModelInstance.actions.setSearchData(event.target.value));
    };

    const triggerFetchTableData = () => {
      dispatch(RiskControlIndexReportModelInstance.asyncActions.fetchTableData());
    };

    useEffect(() => {
      triggerFetchTableData();
    }, [pagination]);

    return (
      <div>
        <Row justify="start" gutter={12}>
          <Col>
            <ThemeInput value={searchData} onChange={handleInputChange}></ThemeInput>
          </Col>
          <Col>
            <ThemeButton onClick={handleSearch}>搜索</ThemeButton>
          </Col>
          <Col>
            <DownloadExcelButton
              fileName="下载文件名称"
              configs={[
                {
                  sheetName: 'sheetName1',
                  dataSource: traderTableData,
                  columns: MainTableColumnsList,
                },
              ]}
            >
              下载
            </DownloadExcelButton>
          </Col>
        </Row>
        <ThemeTable
          style={{ marginTop: GutterEnums.Vertical }}
          pagination={{
            ...pagination,
            total,
          }}
          onChange={handleTableChange}
          rowKey="uuid"
          dataSource={traderTableData}
          loading={searchLoading}
          scroll={{ x: 1500 }}
          columns={MainTableColumnsList}
        />
      </div>
    );
  }),
);

export default RiskControlIndexReport;
