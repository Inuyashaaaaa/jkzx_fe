import { IFormControl } from '@/containers/_Form2';
import { isAllSame } from '@/tools';
import _ from 'lodash';

export const FORM_CONTROLS: (
  prices: any[],
  selectedNodes: any[],
  onIconClick: (dataIndex: string) => void,
  baseContractIdForceEditing: boolean,
  hedgingContractIdForceEditing: boolean
) => IFormControl[] = (
  prices,
  selectedNodes,
  onIconClick,
  baseContractIdForceEditing,
  hedgingContractIdForceEditing
) => {
  const hedgingContractIdHasConflict = hedgingContractIdForceEditing
    ? false
    : selectedNodes.length
    ? !isAllSame(selectedNodes.map(item => item.hedgingContractId))
    : false;
  const baseContractIdHasConflict = baseContractIdForceEditing
    ? false
    : selectedNodes.length
    ? !isAllSame(selectedNodes.map(item => item.baseContractId))
    : false;
  return [
    {
      dataIndex: 'baseContractId',
      control: {
        label: '基础合约',
      },
      input: {
        type: 'select',
        options: prices.map(item => ({
          label: item.instrumentId,
          value: item.instrumentId,
        })),
        placeholder: baseContractIdHasConflict ? '有冲突值，点击解锁' : '',
        subtype: baseContractIdHasConflict ? 'show' : 'editing',
        onIconClick: () => onIconClick('baseContractId'),
      },
    },
    {
      dataIndex: 'hedgingContractId',
      control: {
        label: '对冲合约',
      },
      input: {
        type: 'select',
        options: prices.map(item => ({
          label: item.instrumentId,
          value: item.instrumentId,
        })),
        placeholder: hedgingContractIdHasConflict ? '有冲突值，点击解锁' : '',
        subtype: hedgingContractIdHasConflict ? 'show' : 'editing',
        onIconClick: () => onIconClick('hedgingContractId'),
      },
    },
  ];
};
