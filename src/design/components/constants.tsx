export const EMPTY_VALUE = 'empty';

export const VALIDATE_MESSAGES = {
  default: '字段验证错误 %s',
  required: '%s 为必填项',
  enum: '%s 必须是 %s 其中的一项',
  whitespace: '%s 不能为空',
  date: {
    format: '%s 日期 %s 无效格式化 %s',
    parse: '%s 日期无法被解析, %s 无效 ',
    invalid: '%s 日期 %s 无效',
  },
  types: {
    string: '%s 类型不是 %s',
    method: '%s 类型不是 %s (function)',
    array: '%s 类型不是 %s',
    object: '%s 类型不是 %s',
    number: '%s 类型不是 %s',
    date: '%s 类型不是 %s',
    boolean: '%s 类型不是 %s',
    integer: '%s 类型不是 %s',
    float: '%s 类型不是 %s',
    regexp: '%s 类型不是有效的 %s',
    email: '%s 类型不是有效的 %s',
    url: '%s 类型不是有效的 %s',
    hex: '%s 类型不是有效的 %s',
  },
  string: {
    len: '%s 字符长度必须为 %s',
    min: '%s 字符长度至少为 %s',
    max: '%s 字符长度不能超过 %s',
    range: '%s 字符长度在 %s 到 %s 之间',
  },
  number: {
    len: '%s 大小必须为 %s',
    min: '%s 大小至少为 %s',
    max: '%s 大小不能超过 %s',
    range: '%s 大小在 %s 到 %s 之间',
  },
  array: {
    len: '%s 项目长度必须为 %s',
    min: '%s 项目长度至少为 %s',
    max: '%s 项目长度不能超过 %s',
    range: '%s 项目长度在 %s 到 %s 之间',
  },
  pattern: {
    mismatch: '%s 到值 %s 不匹配正则 %s',
  },
  clone() {
    const cloned = JSON.parse(JSON.stringify(this));
    cloned.clone = this.clone;
    return cloned;
  },
};
