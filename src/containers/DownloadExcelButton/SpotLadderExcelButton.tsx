import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { AnchorButtonProps, NativeButtonProps } from 'antd/lib/button/button';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import XLSX from 'xlsx';

/* list of supported file types */
const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  // tslint:disable-next-line:only-arrow-functions
  .map(function(x) {
    return '.' + x;
  })
  .join(',');

/* generate an array of column objects */
const makeCols = refstr => {
  const outs = [];
  const cols = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < cols; ++i) outs[i] = { name: XLSX.utils.encode_col(i), key: i };
  return outs;
};

class SpotLadderExcelButton extends PureComponent<ImportButtonProps> {
  public exportFile = () => {
    console.log(this.props.data);
    /* convert state to workbook */
    if (!this.checkData(this.props.data)) {
      return;
    }

    const { dataSource, cols, name } = this.props.data;
    // dataSource = dataSource.unshift(cols)
    console.log(dataSource, cols);

    if (this.props.tabs) {
      // 多sheet表导出
      console.log(this.props.tabs);
      const wb = XLSX.utils.book_new();
      this.props.tabs.forEach((item, index) => {
        const ws = XLSX.utils.aoa_to_sheet(dataSource[index]);
        XLSX.utils.book_append_sheet(wb, ws, item);
      });
      return XLSX.writeFile(wb, `${name}.xlsx`);
    }
    const ws = XLSX.utils.aoa_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${name}.xlsx`);
  };

  public checkData = data => {
    // 检查数据
    const flag = true;
    // if(data.dataSource)
    return flag;
  };

  public render() {
    const { children, ...rest } = this.props;
    return (
      <Button {..._.omit(rest) as ButtonProps} onClick={this.exportFile}>
        {children}
      </Button>
    );
  }
}

export default SpotLadderExcelButton;
