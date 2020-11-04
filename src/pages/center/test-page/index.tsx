import { Col, Row } from 'antd';
import { TableProps } from 'antd/lib/table/interface';
import { connect } from 'dva';
import utl from 'lodash';
import React, { memo, useEffect } from 'react';
import { Dispatch } from 'redux';
import { VERTICAL_GUTTER } from '@/constants/global';
import ThemeButton from '@/containers/ThemeButton';
import ThemeInput from '@/containers/ThemeInput';
import ThemeTable from '@/containers/ThemeTable';
import {
  RiskControlIndexReportModel,
  RiskControlIndexReportWithEnhanced,
} from '@/pages/center/test-page/models/table';
import { ModelNameSpaces, RootStore } from '@/typings';

type RiskControlIndexReportProps = {} & {
  dispatch: Dispatch<any>;
} & Pick<
    RiskControlIndexReportModel,
    'traderTableData' | 'pagination' | 'total' | 'searchFormData'
  > & {
    searchLoading: boolean;
  };

const RiskControlIndexReport = memo<RiskControlIndexReportProps>(
  connect(store => {
    const { [ModelNameSpaces.RiskControlIndexReportModel]: model, loading } = store as RootStore;
    return {
      ...utl.pick(model, ['traderTableData', 'pagination', 'total', 'searchFormData']),
      searchLoading:
        loading.effects[`${ModelNameSpaces.RiskControlIndexReportModel}/fetchTableData`],
    };
  })((props: RiskControlIndexReportProps) => {
    const { dispatch, pagination, searchLoading, total, traderTableData, searchFormData } = props;

    const handleTableChange: TableProps<any>['onChange'] = (_pagination, filters, _sorter) => {
      dispatch(
        RiskControlIndexReportWithEnhanced.actions.setTableMeta({
          pagination: _pagination,
          sorter: _sorter,
        }),
      );
    };

    const triggerFetchTableData = () => {
      dispatch(RiskControlIndexReportWithEnhanced.asyncActions.fetchTableData());
    };

    useEffect(() => {
      triggerFetchTableData();
    }, [pagination]);

    const handleSearch = () => {
      triggerFetchTableData();
    };

    const handleInputChange = event => {
      dispatch(RiskControlIndexReportWithEnhanced.actions.setSearchFormData(event.target.value));
    };

    return (
      <div>
        <Row type="flex" justify="start">
          <Col>
            <ThemeInput value={searchFormData} onChange={handleInputChange}></ThemeInput>
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
          columns={[
            {
              title: '指标名称',
              dataIndex: 'riskLimitIndex',
              width: 300,
              fixed: 'left',
            },
            {
              title: '细分类型',
              dataIndex: 'riskLimitCategory',
              width: 250,
            },
            {
              title: '当前状态',
              width: 150,
              dataIndex: 'status',
            },
            {
              title: '当前值',
              width: 200,
              dataIndex: 'currentValue',
              align: 'right',
            },
            {
              title: '警告阈值',
              width: 200,
              dataIndex: 'warningLimit',
              align: 'right',
            },
            {
              title: '严重阈值',
              width: 200,
              dataIndex: 'criticalLimit',
              align: 'right',
            },
            {
              title: '描述信息',
              dataIndex: 'riskLimitDescription',
            },
          ]}
        />
      </div>
    );
  }),
);

export default RiskControlIndexReport;
