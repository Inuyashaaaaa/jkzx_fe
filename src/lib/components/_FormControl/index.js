import InputControl from '@/lib/components/_InputControl';
import Loading from '@/lib/components/_Loading';
import { isShallowEqual, isType } from '@/lib/utils';
import lodash from 'lodash';
import React, { Component } from 'react';
import styles from './index.less';
import { FormControl as types } from './types';

const getDepends = countValue => {
  let depends = [];
  let count = countValue;
  if (isType(countValue, 'Array')) {
    depends = lodash.dropRight(countValue);
    count = countValue[countValue.length - 1];
  }
  return { count, depends };
};

export const selectContentChanged = (
  countValue,
  nextCountValue,
  dataIndex,
  nextDataIndex,
  formData,
  nextFormData
) => {
  const { depends } = getDepends(countValue);
  return (
    nextFormData[nextDataIndex] !== formData[dataIndex] ||
    (nextCountValue
      ? !lodash.isEqual(
          depends.length ? lodash.pick(nextFormData, depends) : nextFormData,
          depends.length ? lodash.pick(formData, depends) : formData
        )
      : false)
  );
};

const isJustSelfFieldValueChange = (curFormData, nextFormData, curFieldName) => {
  let curFieldChanged = false;
  let otherFiledChanged = false;
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in nextFormData) {
    const next = nextFormData[key];
    const cur = curFormData[key];
    if (cur !== next) {
      if (curFieldName === key) {
        curFieldChanged = true;
      } else {
        otherFiledChanged = true;
      }
    }
  }
  return curFieldChanged && !otherFiledChanged;
};

class FormControl extends Component {
  static propTypes = types;

  static defaultProps = {
    field: {},
    formData: {},
    strictUpdate: false,
  };

  selfCauseRender = false;

  constructor(props) {
    super(props);
    this.state = {
      counting: false,
    };
  }

  componentDidMount = () => {
    const { countValue } = this.props;
    if (isType(countValue, 'Function')) {
      // eslint-disable-next-line no-console
      console.warn('countValue 没有定义依赖，会导致效率降低，请确定这是你想要的结果');
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { field, formData, strictUpdate, countValue, dataIndex } = this.props;
    const {
      field: nextField,
      countValue: nextCountValue,
      dataIndex: nextDataIndex,
      formData: nextFormData,
    } = nextProps;

    return (
      (strictUpdate
        ? field.interactive !== nextField.interactive ||
          field.options !== nextField.options ||
          selectContentChanged(
            countValue,
            nextCountValue,
            dataIndex,
            nextDataIndex,
            formData,
            nextFormData
          )
        : !isShallowEqual(this.props, nextProps)) || !isShallowEqual(nextState, this.state)
    );
  };

  componentWillUpdate = nextProps => {
    // 处理 计算数值
    const { countValue, dataIndex, formData } = nextProps;
    const { formData: curFormData } = this.props;
    const { counting, countError } = this.state;

    if (!formData) return;

    // fetch resolve 后需要用到
    this.nextProps = nextProps;

    // 用户手动输入有计算属性的表单控件;
    if (
      countValue &&
      !this.selfCauseRender &&
      isJustSelfFieldValueChange(curFormData, formData, dataIndex)
    ) {
      return;
    }

    if (!this.selfCauseRender) {
      if (counting) {
        this.lastChangeWhenCounting = true;
      }
      if (!countError && !counting && countValue) {
        const result = this.applyCountValue(formData, curFormData);
        if (isType(result, 'Promise')) {
          this.state.counting = true;
          result.then(this.handleAsyncCountThen).catch(() => {
            this.selfCauseRender = true;
            this.setState({
              counting: false,
              countError: true,
            });
          });
        } else {
          this.testChange(result, () => {
            this.selfCauseRender = true;
          });
        }
      }
    } else {
      this.selfCauseRender = false;
    }
  };

  applyCountValue = (nextFormData, oldFormData) => {
    const { countValue } = this.props;
    const { count } = getDepends(countValue);
    return count(nextFormData, oldFormData);
  };

  // eslint-disable-next-line consistent-return
  handleAsyncCountThen = asyncResult => {
    const { formData } = this.nextProps;
    const { formData: curFormData } = this.props;

    if (this.lastChangeWhenCounting) {
      this.lastChangeWhenCounting = false;
      return this.applyCountValue(formData, curFormData).then(this.handleAsyncCountThen);
    }

    // 不管怎么样，下面的代码都会触发一次 render
    this.selfCauseRender = true;
    this.state.counting = false;
    // onChange 可以触发渲染
    const hasChanged = this.testChange(asyncResult);
    if (!hasChanged) {
      // counting === false setState 正常不会触发渲染
      this.forceUpdate();
    }
  };

  testChange = (newValue, beforeChange) => {
    const { value, onChange } = this.props;
    // @todo 针对不同 type 类型，要对 value 判断是否更新的逻辑也不一样
    // 假设目前 type 都是 input 类型，value 为非对象类型
    const hasChanged = !lodash.isEqual(newValue, value);

    if (hasChanged) {
      beforeChange && beforeChange();
      // 在 onFieldsChange 中 dataSourceItem 还没有更新
      // 导致只有最后一次值被 change，加上之后 setTimout 的任务队列比 setState 队列还要靠后执行，
      // 因此不会出现该问题
      setTimeout(() => {
        onChange(newValue);
      });
    }
    return hasChanged;
  };

  // @todo 判断方法统一注入？ 是否必要注入？
  // injectFormMeta = (callback, ...args) => {
  //   const { formData, dataIndex } = this.props;
  //   return callback(...args, dataIndex, formData);
  // };

  // handleOptions = (...args) => {
  //   const { field } = this.props;
  //   return this.injectFormMeta(field.options, ...args);
  // };

  // handleDataSource = (...args) => {
  //   const { field } = this.props;
  //   return this.injectFormMeta(field.dataSource, ...args);
  // };

  // proxyChangePlus = (...args) => {
  //   const { onChangePlus } = this.props;
  //   return this.injectFormMeta(onChangePlus, ...args);
  // };

  render() {
    // console.log('render FormControl')
    const { counting } = this.state;
    const { field, onChange, value } = this.props;

    if (counting) {
      return (
        <div className={styles.loading}>
          <Loading>computing data...</Loading>
        </div>
      );
    }

    return <InputControl {...field} onChange={onChange} value={value} />;
  }
}

export default FormControl;
