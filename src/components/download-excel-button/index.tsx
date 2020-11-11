import { ColumnType } from 'antd/lib/table';
import utl from 'lodash';
import React, { memo } from 'react';
import XLSX from 'xlsx';
import ThemeButton, { ThemeButtonProps } from '../ThemeButton';

type ColType = ColumnType<any>;

const getLetter = (index: number) => {
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

interface DownloadExcelButtonProps extends ThemeButtonProps {
  fileName: string;
  configs: {
    getSheetDataSourceItemMeta?: (cellVal: any, col: ColType, rowIndex: number) => any;
    sheetName: any;
    columns: ColumnType<any>[];
    dataSource: any[][];
  }[];
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => boolean;
}

const DownloadExcelButton = memo<DownloadExcelButtonProps>((props) => {
  const { configs, fileName, onClick, ...restProps } = props;

  const handleBtnClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (onClick) {
      const isCancel = onClick(event);
      if (isCancel) return;
    }

    const wb = XLSX.utils.book_new();

    configs.forEach((meta) => {
      const { sheetName, dataSource, getSheetDataSourceItemMeta, columns } = meta;

      const rowDatas = [
        columns.map((col: ColType) => col.title),
        ...dataSource.map((record, _index) => {
          return columns.map((col: ColType) => {
            const { dataIndex } = col;
            if (dataIndex == null) {
              throw new Error(`${dataIndex} must be exist`);
            }

            let val = record[Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex];
            if (col.render) {
              val = col.render(val, null, _index)
            }
            return val;
          });
        }),
      ];
      const sheetDataSourceMeta = utl.flatten(
        rowDatas.map((rowData, rowIndex) => {
          return rowData.map((cellVal: any, _index: number) => ({
            pos: `${getLetter(_index)}${rowIndex + 1}`,
            value: cellVal,
            meta: getSheetDataSourceItemMeta?.(cellVal, columns[_index], rowIndex),
          }));
        }),
      );

      const ws = XLSX.utils.aoa_to_sheet(rowDatas);

      sheetDataSourceMeta
        .filter((item) => item.meta != null)
        .forEach((item) => {
          ws[item.pos] = {
            v: item.value,
            ...item.meta,
          };
        });

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return <ThemeButton {...restProps} onClick={handleBtnClick} />;
});

export default DownloadExcelButton;
