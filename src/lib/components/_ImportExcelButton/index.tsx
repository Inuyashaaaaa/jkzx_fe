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

export interface ISheetData {
  cols: Array<{
    name: string;
    key: string;
  }>;
  data: string[][];
}

interface IImportButtonProps {
  onImport?: (data: ISheetData) => void;
}

export type ImportButtonProps = ButtonProps & IImportButtonProps;

class ImportExcelButton extends PureComponent<ImportButtonProps> {
  public handleFile = (file /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (event: any) => {
      /* Parse data */
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      // debugger
      let data = null;
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      //   data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      data = wb.SheetNames.map((item, index) => {
        return { [item]: XLSX.utils.sheet_to_json<string[]>(wb.Sheets[item], { header: 1 }) };
      });

      /* Update state */
      this.onImport({ data, cols: wb.SheetNames, fileName: file.name });
      // this.onImport({ data, cols: makeCols(ws['!ref']), fileName: file.name });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  public onImport = (data: ISheetData) => {
    if ('onImport' in this.props) {
      return this.props.onImport(data);
    }
  };

  //   exportFile = () => {
  //     /* convert state to workbook */
  //     const ws = XLSX.utils.aoa_to_sheet(this.state.data);
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  //     /* generate XLSX file and send to client */
  //     XLSX.writeFile(wb, 'sheetjs.xlsx');
  //   };

  public render() {
    const { children, ...rest } = this.props;
    return (
      <Button {..._.omit(rest, ['onImport']) as ButtonProps}>
        {children}
        <DataInput handleFile={this.handleFile} />
      </Button>
    );
  }
}

export interface DataInputProps {
  handleFile: (file: any) => void;
}

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
// tslint:disable-next-line:max-classes-per-file
class DataInput extends PureComponent<DataInputProps> {
  public $input: HTMLInputElement = null;

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  public handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.props.handleFile(files[0]);
    this.$input.value = '';
  }

  public getRef = node => {
    this.$input = node;
  };

  public render() {
    return (
      <input
        ref={this.getRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          fontSize: '0',
          opacity: 0,
          display: 'block',
          cursor: 'pointer',
        }}
        type="file"
        id="file"
        accept={SheetJSFT}
        onChange={this.handleChange}
      />
    );
  }
}

export default ImportExcelButton;
