import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

export interface Upload2Props extends UploadProps {
  label?: string;
  maxLen?: number;
  value?: UploadFile[];
}
