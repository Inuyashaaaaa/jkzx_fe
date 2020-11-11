import { Table, Button } from 'antd'
import { TableProps } from 'antd/lib/table'
import React, { memo } from 'react'
import classnames from 'classnames'
import styles from './index.less'
import { DownloadExcelButton } from '..'

interface ThemeCenterTabelBaseProps {
  // 表格标题
  tabelTitle?: string
  // 导出文件名称
  fileName: string
}

export type ThemeCenterTableProps = ThemeCenterTabelBaseProps & TableProps<object>


const ThemeCenterTable = memo<ThemeCenterTableProps>(props => {
  const { tabelTitle, pagination, className, fileName, ...restProps } = props
  if (pagination) {
    pagination.position = ['bottomRight']
    pagination.simple = true;
  }

  const { columns, dataSource } = restProps

  const configs = [{
    sheetName: 'abc123',
    columns,
    dataSource
  }]

  return (
    <div className={classnames(className, styles.scope)}>
      <div className="table-container-top">
        <h2 className="table-title">{tabelTitle}</h2>
        <DownloadExcelButton
          fileName={fileName}
          configs={configs}
        >
          导出Excel
        </DownloadExcelButton>
      </div>
      <div className="table-container">
        <Table {...restProps} pagination={pagination} />
      </div>
    </div>
  )
})

export default ThemeCenterTable
