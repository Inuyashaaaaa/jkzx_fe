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
} from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/single-party-counterparty-var/models/table'
import { ModelNameSpaces, RootStore } from '@/types';
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { SinglePartyCouterpartyVarVARColumnsList } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/single-party-counterparty-var/constants'
import utl from 'lodash'
import { TableProps } from 'antd/lib/table';
import styles from './index.less'

const { TabPane } = Tabs

type RiskControlSinglePartyCouterpartyVarVaRMonitoringReportProps = {} & {
  dispatch: Dispatch<any>;
} & Pick<RiskControlVarMonitoringReportModel, 'confidence' | 'outlook' | 'pagination' | 'positionDate' | 'singlePartyCouterpartyVarVaRTableData'> & {
  searchLoading: boolean
}

const RiskControlSinglePartyCouterpartyVarVaRMonitoringReport = memo<RiskControlSinglePartyCouterpartyVarVaRMonitoringReportProps>(
  connect((store: RootStore) => {
    const { [ModelNameSpaces.RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel]: model, loading } = store;
    return {
      ...utl.pick(model, ['confidence', 'outlook', 'pagination', 'positionDate', 'singlePartyCouterpartyVarVaRTableData']),
      searchLoading:
        loading.effects[`${ModelNameSpaces.RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel}/fetchSinglePartyCouterpartyVarVaRTableData`]
    }
  })((props: RiskControlSinglePartyCouterpartyVarVaRMonitoringReportProps) => {
    const { dispatch, pagination, searchLoading, confidence, outlook, positionDate, singlePartyCouterpartyVarVaRTableData } = props
    const handleSinglePartyCouterpartyVarVaRTableChange: TableProps<any>['onChange'] = (_pagination) => {
      dispatch(
        RiskControlIndexReportModelInstance.actions.setSinglePartyCouterpartyVarVaRTableMeta({
          pagination: _pagination,
        })
      )
    }

    // form
    const triggerFetchTableData = () => {
      dispatch(RiskControlIndexReportModelInstance.asyncActions.fetchSinglePartyCouterpartyVarVaRTableData())
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
        <h2 className="party-var-title">单一子公司单一对手方VaR</h2>
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
        <div className="party-search">
          <ThemeCenterInput
            inputLabel="子公司："
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
        <ThemeCenterTable
          pagination={{
            ...pagination
          }}
          onChange={handleSinglePartyCouterpartyVarVaRTableChange}
          rowKey="uuid"
          dataSource={singlePartyCouterpartyVarVaRTableData}
          // loading={searchLoading}
          columns={SinglePartyCouterpartyVarVARColumnsList}
        />
      </div>
    )
  })
)


export default RiskControlSinglePartyCouterpartyVarVaRMonitoringReport;
