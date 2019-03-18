# intro

这是一个表格表单，columns 是由 dataSource 来构成的，表单使用双向绑定，保证 onChange 来更新 dataSource 的更新，同步渲染

# props

- onChange
- formData
- dataSource[]
- legs[]
  - name
  - dataIndex
  - type
  - readonly
  - format
  - min
  - max
  - precision 精确小数
  - unit 单位
  - countValue
  - defaultValue
  - options
  - rules

- formItems[]
  - label
  - ...legs.item !defaultValue !countValue

- onFormChange
- onLegChange

# notice

- 所有的 dataSource 中的 legData，其类型必须是 legs 当中指定的
- type === 'date', 'type' 时，需要同时指定 format


