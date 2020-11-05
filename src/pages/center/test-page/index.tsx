import { VERTICAL_GUTTER } from '@/constants/global';
import { ThemeButton, ThemeInput, ThemeTable } from '@/containers';
import {
  RiskControlIndexReportModel,
  RiskControlIndexReportWithEnhanced,
} from '@/pages/center/test-page/models/table';
import { ModelNameSpaces, RootStore } from '@/typings';
import { Col, Row } from 'antd';
import { TableProps } from 'antd/lib/table/interface';
import { connect } from 'dva';
import utl from 'lodash';
import React, { memo, useEffect } from 'react';
import { Dispatch } from 'redux';
import { MainTableColumnsList } from '@/pages/center/test-page/constants';

type RiskControlIndexReportProps = {} & {
  dispatch: Dispatch<any>;
} & Pick<RiskControlIndexReportModel, 'traderTableData' | 'pagination' | 'total' | 'searchData'> & {
    searchLoading: boolean;
  };

const RiskControlIndexReport = memo<RiskControlIndexReportProps>(
  connect(store => {
    const { [ModelNameSpaces.RiskControlIndexReportModel]: model, loading } = store as RootStore;
    return {
      ...utl.pick(model, ['traderTableData', 'pagination', 'total', 'searchData']),
      searchLoading:
        loading.effects[`${ModelNameSpaces.RiskControlIndexReportModel}/fetchTableData`],
    };
  })((props: RiskControlIndexReportProps) => {
    const { dispatch, pagination, searchLoading, total, traderTableData, searchData } = props;

    const handleTableChange: TableProps<any>['onChange'] = (_pagination, filters, _sorter) => {
      dispatch(
        RiskControlIndexReportWithEnhanced.actions.setTableMeta({
          pagination: _pagination,
          sorter: _sorter,
        }),
      );
    };

    const handleSearch = () => {
      triggerFetchTableData();
    };

    const handleInputChange = event => {
      dispatch(RiskControlIndexReportWithEnhanced.actions.setSearchData(event.target.value));
    };

    const triggerFetchTableData = () => {
      dispatch(RiskControlIndexReportWithEnhanced.asyncActions.fetchTableData());
    };

    useEffect(() => {
      triggerFetchTableData();
    }, [pagination]);

    return (
      <div>
        <Row type="flex" justify="start">
          <Col>
            <ThemeInput value={searchData} onChange={handleInputChange}></ThemeInput>
          </Col>
          <Col>
            <ThemeButton onClick={handleSearch}>搜索</ThemeButton>
          </Col>
        </Row>
        <ThemeTable
          style={{ marginTop: VERTICAL_GUTTER }}
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
