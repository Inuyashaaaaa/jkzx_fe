/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo, useState } from 'react';
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
} from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/company-var/models/table'
import { ModelNameSpaces, RootStore } from '@/types';
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { PartyVARColumnsList } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/company-var/constants'
import utl from 'lodash'
import { TableProps } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';
import classnames from 'classnames'
import { UsageState } from 'webpack';
import styles from './index.less'

const { TabPane } = Tabs

type RiskControlPartyVaRMonitoringReportProps = {} & {
  dispatch: Dispatch<any>;
} & Pick<RiskControlVarMonitoringReportModel, 'confidenceLevel' | 'varDay' | 'pagination' | 'date' | 'PartyVaRTableData'> & {
  searchLoading: boolean
}

const RiskControlPartyVaRMonitoringReport = memo<RiskControlPartyVaRMonitoringReportProps>(
  connect((store: RootStore) => {
    const { [ModelNameSpaces.RiskControlVarMonitoringReportModel]: model, loading } = store;
    return {
      ...utl.pick(model, ['confidenceLevel', 'varDay', 'pagination', 'date', 'PartyVaRTableData']),
      searchLoading:
        loading.effects[`${ModelNameSpaces.RiskControlVarMonitoringReportModel}/fetchPartyVaRTableData`]
    }
  })((props: RiskControlPartyVaRMonitoringReportProps) => {
    const { dispatch, pagination, searchLoading, confidenceLevel, varDay, date, PartyVaRTableData } = props
    const [ isConfidenceLevelRequired, setIsConfidenceLevelRequired ] = useState(false)
    const [ isVarDayRequired, setIsVarDayRequired ] = useState(false)
    const [ isDateRequired, setIsDateRequired ] = useState(false)
    const triggerFetchTableData = () => {
      if (confidenceLevel && varDay && date)
      dispatch(RiskControlIndexReportModelInstance.asyncActions.fetchPartyVaRTableData())
    }

    const handlePartyVaRTableChange: TableProps<any>['onChange'] = (_pagination, _filter, _sorter) => {
      dispatch(
        RiskControlIndexReportModelInstance.actions.setPartyVaRTableMeta({
          pagination: _pagination,
          sorter: _sorter as SorterResult<any>
        })
      )
      triggerFetchTableData()
    }

    const handleDateChange = (_date: moment.Moment | null) => {
      if (_date && isDateRequired) setIsDateRequired(false)
      dispatch(RiskControlIndexReportModelInstance.actions.setDate(_date))
    }

    const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value && isConfidenceLevelRequired) setIsConfidenceLevelRequired(false)
      dispatch(RiskControlIndexReportModelInstance.actions.setConfidenceLevel(parseFloat(e.target.value)))
    }

    const handleVarDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value && isVarDayRequired) setIsVarDayRequired(false)
      dispatch(RiskControlIndexReportModelInstance.actions.setVarDay(parseInt(e.target.value, 10)))
    }

    const handleFormConfirm = () => {
      let flag = false
      if (!date) {
        setIsDateRequired(true)
        flag = true
      }
      if (!confidenceLevel) {
        setIsConfidenceLevelRequired(true)
        flag = true
      }
      if (!varDay) {
        setIsVarDayRequired(true)
        flag = true
      }
      if (flag) return
      triggerFetchTableData()
    }

    const handleFormReset = () => {
      dispatch(RiskControlIndexReportModelInstance.actions.setDate(null))
      dispatch(RiskControlIndexReportModelInstance.actions.setConfidenceLevel(null))
      dispatch(RiskControlIndexReportModelInstance.actions.setVarDay(null))
    }

    return (
      <div className={styles.scope}>
        <h2 className="party-var-title">子公司VaR</h2>
        <div className="form-container">
          <ThemeCenterDatePicker
            value={date}
            onChange={handleDateChange}
            datePickLabel="持仓日期："
            placeholder=""
            className={classnames('form-item', {
              'form-require': isDateRequired
            })}
          />
          <ThemeCenterInput
            inputLabel="置信度(%)："
            value={confidenceLevel}
            onChange={handleConfidenceLevelChange}
            placeholder="请输入"
            className={classnames('form-item', {
              'form-require': isConfidenceLevelRequired
            })}
          />
          <ThemeCenterInput
            inputLabel="展望期(天)："
            value={varDay}
            onChange={handleVarDayChange}
            placeholder="请输入"
            className={classnames('form-item', {
              'form-require': isVarDayRequired
            })}
          />
          <ThemeCenterButtonGroup
            resetText="重置"
            onReset={handleFormReset}
            confirmText="确定"
            onConfirm={handleFormConfirm}
          />
        </div>
        <ThemeCenterTabs defaultActiveKey="1" animated={false}>
          <TabPane key="1" tab="子公司VaR">
            <ThemeCenterTable
              fileName="子公司VaR"
              pagination={{
                ...pagination
              }}
              onChange={handlePartyVaRTableChange}
              rowKey="uuid"
              dataSource={PartyVaRTableData}
              loading={searchLoading}
              columns={PartyVARColumnsList}
              tabelTitle="子公司VaR"
              className="party-var-table"
            />
          </TabPane>
          <TabPane key="2" tab="子公司分持仓类型PNL">
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
          <TabPane key="3" tab="子公司分品种PNL">
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
          <TabPane key="4" tab="子公司持仓明细">
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


export default RiskControlPartyVaRMonitoringReport;
