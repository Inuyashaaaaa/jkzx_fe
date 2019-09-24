/* eslint-disable */
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { AnchorButtonProps, NativeButtonProps } from 'antd/lib/button/button';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import XLSX from 'xlsx';
import { Form2 } from '@/containers';
import { getMoment } from '@/tools';

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
  .map(x => `.${x}`)
  .join(',');

/* generate an array of column objects */
const makeCols = refstr => {
  const outs = [];
  const cols = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < cols; ++i) outs[i] = { name: XLSX.utils.encode_col(i), key: i };
  return outs;
};

class DownloadExcelButton extends PureComponent<ImportButtonProps> {
  public handleData = (dataSource, cols, headers) => {
    const data = [];
    data.push(headers);
    const { length } = data;
    dataSource.forEach((ds, index) => {
      const _data = [];
      Object.keys(ds).forEach(key => {
        const dsIndex = _.findIndex(cols, k => k === key);
        if (dsIndex >= 0) {
          _data[dsIndex] = ds[key];
        }
      });
      data.push(_data);
    });
    return data;
  };

  public exportFile = async () => {
    /* convert state to workbook */
    if (!this.checkData(this.props.data)) {
      return;
    }
    const {
      searchMethod,
      cols,
      name,
      argument,
      colSwitch,
      sortBy,
      handleDataSource,
      getSheetDataSourceItemMeta,
      sheetName = 'SheetJS',
    } = this.props.data;
    const { searchFormData, sortField = {} } = argument;
    const { error, data: _data } = await searchMethod({
      ..._.mapValues(Form2.getFieldsValue(searchFormData), (values, key) => {
        if (key === 'valuationDate') {
          return getMoment(values).format('YYYY-MM-DD');
        }
        return values;
      }),
      ...sortField,
    });

    if (error) return;
    const dataIndex = _.flatten(
      cols.map(item =>
        item.children ? item.children.map(iitem => iitem.dataIndex) : item.dataIndex,
      ),
    );
    const title = _.flatten(
      cols.map(item => (item.children ? item.children.map(iitem => iitem.title) : item.title)),
    );

    let newData = [];
    if ((!_data.page && _.isArray(_data)) || handleDataSource) {
      newData = handleDataSource ? handleDataSource(_.isArray(_data) ? _data : _data.page) : _data;
    } else {
      newData =
        name === '定制化报告'
          ? (_data.page || []).map(item =>
              _.mapValues(item.reportData, (value, key) => {
                const col = colSwitch.find((iitem, keys) => iitem.dataIndex === key);
                if (col) {
                  return col.options[value];
                }
                return value;
              }),
            )
          : (_data.page || []).map(item =>
              _.mapValues(item, (value, key) => {
                const col = colSwitch.find((iitem, keys) => iitem.dataIndex === key);
                if (col) {
                  return col.options[value];
                }
                return value;
              }),
            );
    }

    if (sortBy) {
      newData = _.reverse(_.sortBy(newData, 'sortBy'));
    }

    const sheetDataSource = this.handleData(newData, dataIndex, title);

    let sheetDataSourceMeta;

    const getLetter = index => {
      const LETTERS = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ];

      const arrs = [];
      let next = index;
      do {
        const s = Math.floor(next / 26);
        const y = next % 26;
        arrs.unshift(y);
        next = s;
      } while (next !== 0);
      return arrs
        .map((item, iindex) => LETTERS[item - (arrs.length > 1 && iindex === 0 ? 1 : 0)])
        .join('');
    };

    if (getSheetDataSourceItemMeta) {
      sheetDataSourceMeta = _.flatten(
        sheetDataSource.map((array, rowIndex) =>
          array.map((cellVal, index) => ({
            pos: `${getLetter(index)}${rowIndex + 1}`,
            value: cellVal,
            meta: getSheetDataSourceItemMeta(cellVal, dataIndex[index], rowIndex),
          })),
        ),
      );
    }

    // 似乎没有用到
    if (this.props.tabs) {
      // 多sheet表导出
      const wb = XLSX.utils.book_new();
      this.props.tabs.forEach((item, index) => {
        const ws = XLSX.utils.aoa_to_sheet(sheetDataSource[index]);
        XLSX.utils.book_append_sheet(wb, ws, item);
      });
      return XLSX.writeFile(wb, `${name}.xlsx`);
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetDataSource);

    if (sheetDataSourceMeta) {
      sheetDataSourceMeta
        .filter(item => !!item.meta)
        .forEach(item => {
          ws[item.pos] = {
            v: item.value,
            ...item.meta,
          };
        });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
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
    const { children, component: Container = Button, ...rest } = this.props;
    return (
      <Container {...(_.omit(rest) as ButtonProps)} onClick={this.exportFile}>
        {children}
      </Container>
    );
  }
}

export default DownloadExcelButton;
