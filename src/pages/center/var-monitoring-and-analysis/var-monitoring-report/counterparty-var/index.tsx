import React, { memo, useEffect } from 'react';
import {
  ThemeCenterTable,
  ThemeCenterTabs,
  ThemeCenterDatePicker,
  ThemeCenterInput,
  ThemeCenterButtonGroup
} from '@/components'
import { Tabs } from 'antd'
import RiskControlIndexReportModelInstance, {
  RiskControlVarMonitoringReportModel,
} from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/counterparty-var/models/table'
import { ModelNameSpaces, RootStore } from '@/types';
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { CounterpartyVARColumnsList } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/counterparty-var/constants'
import utl from 'lodash'
import { TableProps } from 'antd/lib/table';
import styles from './index.less'

const { TabPane } = Tabs

type RiskControlCounterpartyVaRMonitoringReportProps = {} & {
  dispatch: Dispatch<any>;
} & Pick<RiskControlVarMonitoringReportModel, 'confidence' | 'outlook' | 'pagination' | 'positionDate' | 'counterpartyVaRTableData'> & {
  searchLoading: boolean
}

const RiskControlCounterpartyVaRMonitoringReport = memo<RiskControlCounterpartyVaRMonitoringReportProps>(
  connect((store: RootStore) => {
    const { [ModelNameSpaces.RiskControlCounterpartyVarMonitoringReportModel]: model, loading } = store;
    return {
      ...utl.pick(model, ['confidence', 'outlook', 'pagination', 'positionDate', 'counterpartyVaRTableData']),
      searchLoading:
        loading.effects[`${ModelNameSpaces.RiskControlCounterpartyVarMonitoringReportModel}/fetchCounterpartyVaRTableData`]
    }
  })((props: RiskControlCounterpartyVaRMonitoringReportProps) => {
    const { dispatch, pagination, searchLoading, confidence, outlook, positionDate, counterpartyVaRTableData} = props
    const handleCounterpartyVaRTableChange: TableProps<any>['onChange'] = (_pagination, _filters, _sorter) => {
      console.log(_sorter)
      dispatch(
        RiskControlIndexReportModelInstance.actions.setCounterpartyVaRTableMeta({
          pagination: _pagination,
        })
      )
    }

    // form
    const triggerFetchTableData = () => {
      dispatch(RiskControlIndexReportModelInstance.asyncActions.fetchCounterpartyVaRTableData())
    }

    const handlePositionDateChange = (date: moment.Moment | null) => {
      dispatch(RiskControlIndexReportModelInstance.actions.setPositionDate(date))
    }

    const handleConfidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(RiskControlIndexReportModelInstance.actions.setConfidence(parseFloat(e.target.value)))
    }

    const handleOutlookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(RiskControlIndexReportModelInstance.actions.setOutlook(parseInt(e.target.value, 10)))
    }

    const handleFormConfirm = () => {
      triggerFetchTableData()
    }

    const handleFormReset = () => {
      dispatch(RiskControlIndexReportModelInstance.actions.setPositionDate(null))
      dispatch(RiskControlIndexReportModelInstance.actions.setConfidence(null))
      dispatch(RiskControlIndexReportModelInstance.actions.setOutlook(null))
    }

    useEffect(() => {
      const getData = async () => {
        await triggerFetchTableData()
      }
      getData()
    }, [pagination])

    return (
      <div className={styles.scope}>
        <h2 className="party-var-title">对手方VaR</h2>
        <div className="form-container">
          <ThemeCenterDatePicker
            value={positionDate}
            onChange={handlePositionDateChange}
            datePickLabel="持仓日期："
            placeholder=""
            className="form-item"
          />
          <ThemeCenterInput
            inputLabel="置信度(%)："
            value={confidence}
            onChange={handleConfidenceChange}
            placeholder="请输入"
            className="form-item"
          />
          <ThemeCenterInput
            inputLabel="展望期(天)："
            value={outlook}
            onChange={handleOutlookChange}
            placeholder="请输入"
            className="form-item"
          />
          <ThemeCenterButtonGroup
            resetText="重置"
            onReset={handleFormReset}
            confirmText="确定"
            onConfirm={handleFormConfirm}
          />
        </div>
        <ThemeCenterTabs defaultActiveKey="1" animated={false}>
          <TabPane key="1" tab="对手方VaR">
            <ThemeCenterTable
              pagination={{
                ...pagination
              }}
              onChange={handleCounterpartyVaRTableChange}
              rowKey="uuid"
              dataSource={counterpartyVaRTableData}
              // loading={searchLoading}
              columns={CounterpartyVARColumnsList}
              tabelTitle="对手方VaR"
            />
          </TabPane>
          <TabPane key="2" tab="对手方分子公司PNL">
            {/* <ThemeCenterTable
              pagination={{
                ...pagination,
                simple: true
              }}
              onChange={handlePartyVaRTableChange}
              rowKey="uuid"
              dataSource={PartyVaRTableData}
              loading={searchLoading}
              columns={PartyVARColumnsList}
              tabelTitle="子公司VaR"
            /> */}
          </TabPane>
          <TabPane key="3" tab="对手方分品种PNL">
            {/* <ThemeCenterTable
              pagination={{
                ...pagination,
                simple: true
              }}
              onChange={handlePartyVaRTableChange}
              rowKey="uuid"
              dataSource={PartyVaRTableData}
              loading={searchLoading}
              columns={PartyVARColumnsList}
              tabelTitle="子公司VaR"
            /> */}
          </TabPane>
          <TabPane key="4" tab="对手方持仓明细">
            {/* <ThemeCenterTable
              pagination={{
                ...pagination,
                simple: true
              }}
              onChange={handlePartyVaRTableChange}
              rowKey="uuid"
              dataSource={PartyVaRTableData}
              loading={searchLoading}
              columns={PartyVARColumnsList}
              tabelTitle="子公司VaR"
            /> */}
          </TabPane>
        </ThemeCenterTabs>
      </div>
    )
  })
)


export default RiskControlCounterpartyVaRMonitoringReport;
