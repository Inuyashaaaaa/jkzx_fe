import React, { PureComponent } from 'react';
import TablePlus from '@/components/_TablePlus';
import FormPlus from '@/components/_FormPlus';
import { SearchTablePlus as types } from '@/components/_SearchTablePlus/types';
import '@/components/_SearchTablePlus/index.less';
import lodash from 'lodash';

class SearchTablePlus extends PureComponent {
  static propTypes = types;

  static defaultSearchText = '搜索';

  static defaultResetText = '重置';

  static defaultProps = {
    sections: [],
  };

  handleButtonClick = event => {
    const {
      form: { onSearch, onReset },
    } = this.props;
    if (event.name === SearchTablePlus.defaultSearchText) {
      this.$formPlus?.validateForm(({ error, values }) => {
        if (error) return;
        onSearch?.({ event, values });
      });
    }

    if (event.name === SearchTablePlus.defaultResetText) {
      return onReset?.() || this.$formPlus?.resetForm();
    }
  };

  render() {
    const { form, ...tableProps } = this.props;
    let { sections } = tableProps;

    // user topRight priority high
    if (form) {
      const {
        searchText = SearchTablePlus.defaultSearchText,
        resetText = SearchTablePlus.defaultResetText,
        resetable = false,
      } = form;

      sections = [
        {
          placement: 'topRight',
          content: {
            onClick: this.handleButtonClick,
            items: [
              {
                name: searchText,
                type: 'primary',
              },
              ...(resetable
                ? [
                    {
                      name: resetText,
                    },
                  ]
                : []),
            ],
          },
        },
        ...sections,
      ];
    }

    return (
      <>
        {form && (
          <FormPlus
            {...lodash.omit(form, ['onSearch', 'searchText', 'searchLoading'])}
            footer={false}
            ref={node => {
              this.$formPlus = node;
            }}
          />
        )}
        <TablePlus {...tableProps} sections={sections} />
      </>
    );
  }
}

export default SearchTablePlus;
