import { BIG_NUMBER_CONFIG, INPUT_NUMBER_PERCENTAGE_CONFIG } from '@/constants/common';
import { HOST_TEST } from '@/constants/global';
import { TRNORS_OPTS } from '@/constants/model';
import { request } from '@/lib/utils';
import { BigNumber } from 'bignumber.js';
import lodash from 'lodash';
import uuidv4 from 'uuid/v4';

/**
 * 获取插值（行权价）无风险利率
 *
 * modelName - 分组
 * underlyer - 标的物
 * modelType - vol_surface 波动率曲面
 * instance - intraday
 *
 * @export
 * @returns
 */
export function queryModelRiskFreeCurve(params) {
  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlModelDataGet',
      params: {
        instance: 'intraday',
        modelType: 'risk_free_curve',
        ...params,
      },
    },
  }).then(result => {
    const { error, data } = result;
    if (error) return result;

    const {
      modelInfo: { instruments },
    } = data;

    return {
      error,
      data: {
        dataSource: instruments.map(item => {
          return {
            ...item,
            id: uuidv4(),
            quote: new BigNumber(item.quote)
              .multipliedBy(100)
              .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              .toNumber(),
          };
        }),
      },
    };
  });
}

/**
 * 获取插值（行权价）分红曲线
 *
 * modelName - 分组
 * underlyer - 标的物
 * modelType - vol_surface 波动率曲面
 * instance - intraday
 *
 * @export
 * @returns
 */
export function queryModelDividendCurve(params, passError) {
  return request(
    `${HOST_TEST}model-service/api/rpc`,
    {
      method: 'POST',
      body: {
        method: 'mdlModelDataGet',
        params: {
          instance: 'intraday',
          modelType: 'dividend_curve',
          ...params,
        },
      },
    },
    passError
  ).then(result => {
    const { error, data } = result;
    if (error) return result;

    const {
      modelInfo: { instruments },
    } = data;

    return {
      error,
      data: {
        dataSource: instruments.map(item => {
          return {
            ...item,
            id: uuidv4(),
            quote: new BigNumber(item.quote)
              .multipliedBy(100)
              .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              .toNumber(),
          };
        }),
      },
    };
  });
}

export function saveModelRiskFreeCurve(params) {
  const { dataSource, modelName } = params;

  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlCurveRiskFreeCreate',
      params: {
        save: true,
        instance: 'intraday',
        instruments: dataSource.map(item => {
          return {
            ...item,
            quote: new BigNumber(item.quote)
              .dividedBy(100)
              .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              .toNumber(),
            id: undefined,
          };
        }),
        modelName,
      },
    },
  });
}

export function saveModelDividendCurve(params) {
  const { dataSource, modelName, underlyer } = params;

  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlCurveDividendCreate',
      params: {
        save: true,
        instance: 'intraday',
        instruments: dataSource.map(item => {
          return {
            ...item,
            quote: new BigNumber(item.quote)
              .div(100)
              .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              .toNumber(),
            id: undefined,
          };
        }),
        modelName,
        underlyer,
      },
    },
  });
}

/**
 * 获取插值（行权价）波动率曲面数据
 *
 * modelName - 分组
 * underlyer - 标的物
 * modelType - vol_surface 波动率曲面
 * instance - intraday
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function queryModelVolSurface(params, passError) {
  return request(
    `${HOST_TEST}model-service/api/rpc`,
    {
      method: 'POST',
      body: {
        method: 'mdlModelDataGet',
        params: {
          modelType: 'vol_surface',
          ...params,
        },
      },
    },
    passError
  ).then(result => {
    const { error, data } = result;

    if (error) return result;

    const {
      modelInfo: { volGrid, underlyer },
    } = data;

    const columns = [
      {
        headerName: '期限',
        field: 'tenor',
        editable: true,
        input: {
          type: 'select',
          options: TRNORS_OPTS.map(item => {
            return {
              label: item.name,
              value: item.name,
            };
          }),
        },
      },
      ...lodash
        .unionBy(
          volGrid.reduce((allVols, vg) => {
            return allVols.concat(vg.vols);
          }, []),
          item => item.label
        )
        .map(vol => {
          return {
            percent: vol.percent,
            headerName: vol.label,
            field: vol.label,
            editable: true,
            input: INPUT_NUMBER_PERCENTAGE_CONFIG,
          };
        }),
    ];

    const dataSource = volGrid.map(item => {
      const { vols } = item;
      const uuid = uuidv4();
      return {
        id: uuid,
        tenor: item.tenor,
        ...vols.reduce((obj, next) => {
          const { label, quote } = next;
          obj[label] = new BigNumber(quote)
            .multipliedBy(100)
            .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
            .toNumber();
          return obj;
        }, {}),
      };
    });

    return {
      error,
      data: {
        columns,
        dataSource,
        underlyer,
      },
    };
  });
}

export async function saveModelVolSurface(params) {
  const { columns, dataSource, underlyer, newQuote, modelName, instance } = params;

  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlVolSurfaceInterpolatedStrikeCreate',
      params: {
        daysInYear: 365,
        save: true,
        instance,
        modelName,
        underlyer: {
          ...underlyer,
          quote: newQuote,
        },
        instruments: dataSource.map(record => {
          return {
            tenor: record.tenor,
            vols: columns
              .filter(col => col.field !== 'tenor')
              .map(col => {
                const { percent, headerName: label } = col;
                return {
                  label,
                  quote: new BigNumber(record[label])
                    .dividedBy(100)
                    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                    .toNumber(),
                  // strike: new BigNumber(newQuote).multipliedBy(percent).toNumber(),
                  percent,
                };
              }),
          };
        }),
      },
    },
  });
}

/**
 * 获取分组
 *
 * modelType - vol_surface 波动率曲面
 * underlyer - 标的物
 * instance - intraday
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function queryModelName(params) {
  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlModelList',
      params: {
        instance: 'intraday',
        ...params,
      },
    },
  });
}

/**
 * 获取不区分标的物分组
 *
 * modelType - vol_surface 波动率曲面
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function queryAllModelName(params = {}) {
  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlGetAllModelNames',
      params: {
        modelType: 'DIVIDEND_CURVE',
        ...params,
      },
    },
  });
}

export async function queryAllModelNameVol(params = {}) {
  return request(`${HOST_TEST}model-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mdlGetAllModelNames',
      params: {
        modelType: 'VOL_SURFACE',
        ...params,
      },
    },
  });
}
