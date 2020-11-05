/* md5: 9779a62c50d31d3de45b46efb2f2d71c */
/* Rap仓库id: 33 */
/* Rapper版本: 1.2.1 */
/* eslint-disable */
/* tslint:disable */

/**
 * 本文件由 Rapper 同步 Rap 平台接口，自动生成，请勿修改
 * Rap仓库 地址: http://10.1.5.117:3000/repository/editor?id=33
 */

import * as commonLib from '@ty-devops-tools/api-generator/runtime/commonLib';
import { ResponseData, ResultData, BCTAPIData } from '@/utils/request';

export interface IModels {
  /**
   * 接口名：实例接口（注意结尾的method约定）
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=33&mod=113&itf=346
   */
  'POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged': {
    Req: {
      method: string;
      params: {
        page?: number;
        pageSize?: number;
        baseDate?: string;
      };
    };
    Res: {
      jsonrpc?: string;
      id?: string;
      result?: {
        page?: {
          uuid?:
            | string
            | number
            | boolean
            | {
                [k: string]: any;
              };
          baseDate?: string;
          /**
           * 指标名称
           */
          riskLimitIndex?: string;
          /**
           * 描述信息
           */
          riskLimitDescription?: string;
          /**
           * 细分类型
           */
          riskLimitCategory?: string;
          /**
           * 当前值
           */
          currentValue?: number;
          /**
           * 当前状态
           */
          status?: string;
          /**
           * 警告阈值
           */
          warningLimit?: number;
          /**
           * 严重阈值
           */
          criticalLimit?: number;
        }[];
        totalCount?: number;
      };
    };
  };

  /**
   * 接口名：report-rptPosition
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=69&itf=177
   */
  'POST/report-service/api/rpc': {
    Req: {
      method: string;
      params: {
        reportType: string;
      };
    };
    Res: {
      id: string;
      jsonrpc: string;
      result?: any[];
    };
  };

  /**
   * 接口名：payableSearchPaged
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=71&itf=184
   */
  'POST/account-service/api/rpc/method=payableSearchPaged': {
    Req: {
      method: string;
      params: {
        page?: number;
        pageSize?: number;
        payableEventTypeEnum?: string;
        status?: string;
        counterPartyName?: string;
        masterAgreementId?: string;
        tradeId?: string;
        comments?: string;
        payableEffectiveDate?: string;
        payableExpirationDate?: string;
        paymentEffectiveDate?: string;
        paymentExpirationDate?: string;
      };
    };
    Res: {
      jsonrpc: string;
      id: string;
      result?: {
        page?: {
          id?: string;
          counterPartyName?: string;
          masterAgreementId?: string;
          tradeId?: string;
          comments?: string;
          payableEventType?: string;
          status?: string;
          payableEffectiveDate?: string;
          payableExpirationDate?: string;
          paymentEffectiveDate?: string;
          paymentExpirationDate?: string;
          paymentDate?: string;
          payableDate?: string;
          createdAt?: string;
          updatedAt?: string;
          paymentAmount?: number;
          payableAmount?: number;
          paymentId?: string;
          bankAccount?: string;
          bankAccountName?: string;
          bankName?: string;
          positionId?: string;
        }[];
        totalCount?: number;
      };
      error?: {
        code?: number;
        message?: string;
      };
    };
  };

  /**
   * 接口名：saveUserTableConfig
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=72&itf=186
   */
  'POST/user-preference-service/api/rpc/method=saveUserTableConfig': {
    Req: {
      method: string;
      params: {
        formName: string;
        columnNames: any[];
      };
    };
    Res: {
      jsonrpc: string;
      id: string;
      error?: {
        code?: number;
        message?: string;
      };
      result?: {
        formName?: string;
        uuid?: string;
        userId?: string;
      };
    };
  };

  /**
   * 接口名：getUserTableConfig
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=72&itf=187
   */
  'POST/user-preference-service/api/rpc/method=getUserTableConfig': {
    Req: {
      method: string;
      params: {
        formName?: string;
      };
    };
    Res: {
      jsonrpc: string;
      id: string;
      result?: {
        id?: string;
        userId?: string;
        formName?: string;
        columnNames?: any[];
        uuid?: string;
      };
      error?: {
        code?: number;
        message?: string;
      };
    };
  };

  /**
   * 接口名：获取中证协数据报告
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=267
   */
  'POST/document-service/api/rpc/method=queryDailyTradeReports': {
    Req: {
      method: string;
      params: {
        pageNum?: number;
        pageSize?: number;
        /**
         * 时间戳
         */
        startTime?: number;
        /**
         * 时间戳
         */
        endTime?: number;
      };
    };
    Res: {
      jsonrpc?: string;
      id?: string;
      result?: {
        documents?: {
          uuid?: string;
          /**
           * 始终为空
           */
          absolutePath?: null;
          fileName?: string;
          refDate?: string;
          createdAt?: string;
          updatedAt?: string;
        }[];
        pageNum?: number;
        pageSize?: number;
        totalPage?: number;
        totalNumbers?: number;
      };
    };
  };

  /**
   * 接口名：删除中证协数据报告
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=268
   */
  'POST/document-service/api/rpc/method=removeDailyTradeReports': {
    Req: {
      method: string;
      params: {
        documentIds?: string[];
      };
    };
    Res: {};
  };

  /**
   * 接口名：下载中证协报告
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=269
   */
  'GET/bct/downloadExtDoc': {
    Req: {
      docId: string;
    };
    Res: {};
  };

  /**
   * 接口名：上传中证协数据报告
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=270
   */
  'POST/document-service/api/upload/rpc/method=uploadDailyTradeReport': {
    Req: {
      /**
       * 当前操作用户
       */
      operator?: string;
      filename: string;
    };
    Res: {};
  };

  /**
   * 接口名：查询分红信息
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=286
   */
  'POST/trade-service/api/rpc?method=mktStockSearch': {
    Req: {};
    Res: {};
  };

  /**
   * 接口名：试结算
   * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=105&itf=314
   */
  'GET/trade-service/api/rpc/method=tradeExercisePreSettle': {
    Req: {
      method?: string;
      params?: {
        userLoginId?: string;
        tradeId?: string;
        positionId?: string;
        eventDetail?: {};
        eventType?: string;
      };
    };
    Res: {
      jsonrpc?: string;
      id?: string;
      result?: number;
    };
  };
}

type ResSelector<T extends BCTAPIData> = ResponseData<ResultData<T>>;

export interface IResponseTypes {
  'POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged': ResSelector<
    IModels['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged']['Res']
  >;
  'POST/report-service/api/rpc': ResSelector<IModels['POST/report-service/api/rpc']['Res']>;
  'POST/account-service/api/rpc/method=payableSearchPaged': ResSelector<
    IModels['POST/account-service/api/rpc/method=payableSearchPaged']['Res']
  >;
  'POST/user-preference-service/api/rpc/method=saveUserTableConfig': ResSelector<
    IModels['POST/user-preference-service/api/rpc/method=saveUserTableConfig']['Res']
  >;
  'POST/user-preference-service/api/rpc/method=getUserTableConfig': ResSelector<
    IModels['POST/user-preference-service/api/rpc/method=getUserTableConfig']['Res']
  >;
  'POST/document-service/api/rpc/method=queryDailyTradeReports': ResSelector<
    IModels['POST/document-service/api/rpc/method=queryDailyTradeReports']['Res']
  >;
  'POST/document-service/api/rpc/method=removeDailyTradeReports': ResSelector<
    IModels['POST/document-service/api/rpc/method=removeDailyTradeReports']['Res']
  >;
  'GET/bct/downloadExtDoc': ResSelector<IModels['GET/bct/downloadExtDoc']['Res']>;
  'POST/document-service/api/upload/rpc/method=uploadDailyTradeReport': ResSelector<
    IModels['POST/document-service/api/upload/rpc/method=uploadDailyTradeReport']['Res']
  >;
  'POST/trade-service/api/rpc?method=mktStockSearch': ResSelector<
    IModels['POST/trade-service/api/rpc?method=mktStockSearch']['Res']
  >;
  'GET/trade-service/api/rpc/method=tradeExercisePreSettle': ResSelector<
    IModels['GET/trade-service/api/rpc/method=tradeExercisePreSettle']['Res']
  >;
}

export function createFetch(fetchConfig: commonLib.RequesterOption) {
  const rapperFetch = commonLib.getRapperRequest(fetchConfig);

  return {
    /**
     * 接口名：实例接口（注意结尾的method约定）
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=33&mod=113&itf=346
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged': (
      req?: IModels['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                page: { type: 'number', additionalProperties: false, required: [] },
                pageSize: { type: 'number', additionalProperties: false, required: [] },
                baseDate: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            id: { type: 'string', additionalProperties: false, required: [] },
            result: {
              type: 'object',
              properties: {
                page: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      uuid: {
                        type: ['string', 'number', 'boolean', 'object'],
                        additionalProperties: false,
                        required: [],
                      },
                      baseDate: { type: 'string', additionalProperties: false, required: [] },
                      riskLimitIndex: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                        description: '指标名称',
                      },
                      riskLimitDescription: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                        description: '描述信息',
                      },
                      riskLimitCategory: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                        description: '细分类型',
                      },
                      currentValue: {
                        type: 'number',
                        additionalProperties: false,
                        required: [],
                        description: '当前值',
                      },
                      status: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                        description: '当前状态',
                      },
                      warningLimit: {
                        type: 'number',
                        additionalProperties: false,
                        required: [],
                        description: '警告阈值',
                      },
                      criticalLimit: {
                        type: 'number',
                        additionalProperties: false,
                        required: [],
                        description: '严重阈值',
                      },
                    },
                    required: [],
                    additionalProperties: false,
                  },
                  additionalProperties: false,
                  required: [],
                },
                totalCount: { type: 'number', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: [],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/346'
            : '/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<
        IResponseTypes['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged']
      >;
    },

    /**
     * 接口名：report-rptPosition
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=69&itf=177
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/report-service/api/rpc': (
      req?: IModels['POST/report-service/api/rpc']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                reportType: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: ['reportType'],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: {
          type: 'object',
          properties: {
            id: { type: 'string', additionalProperties: false, required: [] },
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            result: { type: 'array', additionalProperties: false, required: [] },
          },
          additionalProperties: false,
          required: ['id', 'jsonrpc'],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/177'
            : '/report-service/api/rpc',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['POST/report-service/api/rpc']>;
    },

    /**
     * 接口名：payableSearchPaged
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=71&itf=184
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/account-service/api/rpc/method=payableSearchPaged': (
      req?: IModels['POST/account-service/api/rpc/method=payableSearchPaged']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                page: { type: 'number', additionalProperties: false, required: [] },
                pageSize: { type: 'number', additionalProperties: false, required: [] },
                payableEventTypeEnum: { type: 'string', additionalProperties: false, required: [] },
                status: { type: 'string', additionalProperties: false, required: [] },
                counterPartyName: { type: 'string', additionalProperties: false, required: [] },
                masterAgreementId: { type: 'string', additionalProperties: false, required: [] },
                tradeId: { type: 'string', additionalProperties: false, required: [] },
                comments: { type: 'string', additionalProperties: false, required: [] },
                payableEffectiveDate: { type: 'string', additionalProperties: false, required: [] },
                payableExpirationDate: {
                  type: 'string',
                  additionalProperties: false,
                  required: [],
                },
                paymentEffectiveDate: { type: 'string', additionalProperties: false, required: [] },
                paymentExpirationDate: {
                  type: 'string',
                  additionalProperties: false,
                  required: [],
                },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            id: { type: 'string', additionalProperties: false, required: [] },
            result: {
              type: 'object',
              properties: {
                page: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', additionalProperties: false, required: [] },
                      counterPartyName: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      masterAgreementId: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      tradeId: { type: 'string', additionalProperties: false, required: [] },
                      comments: { type: 'string', additionalProperties: false, required: [] },
                      payableEventType: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      status: { type: 'string', additionalProperties: false, required: [] },
                      payableEffectiveDate: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      payableExpirationDate: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      paymentEffectiveDate: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      paymentExpirationDate: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      paymentDate: { type: 'string', additionalProperties: false, required: [] },
                      payableDate: { type: 'string', additionalProperties: false, required: [] },
                      createdAt: { type: 'string', additionalProperties: false, required: [] },
                      updatedAt: { type: 'string', additionalProperties: false, required: [] },
                      paymentAmount: { type: 'number', additionalProperties: false, required: [] },
                      payableAmount: { type: 'number', additionalProperties: false, required: [] },
                      paymentId: { type: 'string', additionalProperties: false, required: [] },
                      bankAccount: { type: 'string', additionalProperties: false, required: [] },
                      bankAccountName: {
                        type: 'string',
                        additionalProperties: false,
                        required: [],
                      },
                      bankName: { type: 'string', additionalProperties: false, required: [] },
                      positionId: { type: 'string', additionalProperties: false, required: [] },
                    },
                    required: [],
                    additionalProperties: false,
                  },
                  additionalProperties: false,
                  required: [],
                },
                totalCount: { type: 'number', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
            error: {
              type: 'object',
              properties: {
                code: { type: 'number', additionalProperties: false, required: [] },
                message: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['jsonrpc', 'id'],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/184'
            : 'account-service/api/rpc/method=payableSearchPaged',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['POST/account-service/api/rpc/method=payableSearchPaged']>;
    },

    /**
     * 接口名：saveUserTableConfig
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=72&itf=186
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/user-preference-service/api/rpc/method=saveUserTableConfig': (
      req?: IModels['POST/user-preference-service/api/rpc/method=saveUserTableConfig']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                formName: { type: 'string', additionalProperties: false, required: [] },
                columnNames: { type: 'array', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: ['formName', 'columnNames'],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            id: { type: 'string', additionalProperties: false, required: [] },
            error: {
              type: 'object',
              properties: {
                code: { type: 'number', additionalProperties: false, required: [] },
                message: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
            result: {
              type: 'object',
              properties: {
                formName: { type: 'string', additionalProperties: false, required: [] },
                uuid: { type: 'string', additionalProperties: false, required: [] },
                userId: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['jsonrpc', 'id'],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/186'
            : 'user-preference-service/api/rpc/method=saveUserTableConfig',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<
        IResponseTypes['POST/user-preference-service/api/rpc/method=saveUserTableConfig']
      >;
    },

    /**
     * 接口名：getUserTableConfig
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=72&itf=187
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/user-preference-service/api/rpc/method=getUserTableConfig': (
      req?: IModels['POST/user-preference-service/api/rpc/method=getUserTableConfig']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                formName: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            id: { type: 'string', additionalProperties: false, required: [] },
            result: {
              type: 'object',
              properties: {
                id: { type: 'string', additionalProperties: false, required: [] },
                userId: { type: 'string', additionalProperties: false, required: [] },
                formName: { type: 'string', additionalProperties: false, required: [] },
                columnNames: { type: 'array', additionalProperties: false, required: [] },
                uuid: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
            error: {
              type: 'object',
              properties: {
                code: { type: 'number', additionalProperties: false, required: [] },
                message: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['jsonrpc', 'id'],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/187'
            : 'user-preference-service/api/rpc/method=getUserTableConfig',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<
        IResponseTypes['POST/user-preference-service/api/rpc/method=getUserTableConfig']
      >;
    },

    /**
     * 接口名：获取中证协数据报告
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=267
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/document-service/api/rpc/method=queryDailyTradeReports': (
      req?: IModels['POST/document-service/api/rpc/method=queryDailyTradeReports']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                pageNum: { type: 'number', additionalProperties: false, required: [] },
                pageSize: { type: 'number', additionalProperties: false, required: [] },
                startTime: {
                  type: 'number',
                  additionalProperties: false,
                  required: [],
                  description: '时间戳',
                },
                endTime: {
                  type: 'number',
                  additionalProperties: false,
                  required: [],
                  description: '时间戳',
                },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            id: { type: 'string', additionalProperties: false, required: [] },
            result: {
              type: 'object',
              properties: {
                documents: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      uuid: { type: 'string', additionalProperties: false, required: [] },
                      absolutePath: {
                        type: 'null',
                        additionalProperties: false,
                        required: [],
                        description: '始终为空',
                      },
                      fileName: { type: 'string', additionalProperties: false, required: [] },
                      refDate: { type: 'string', additionalProperties: false, required: [] },
                      createdAt: { type: 'string', additionalProperties: false, required: [] },
                      updatedAt: { type: 'string', additionalProperties: false, required: [] },
                    },
                    required: [],
                    additionalProperties: false,
                  },
                  additionalProperties: false,
                  required: [],
                },
                pageNum: { type: 'number', additionalProperties: false, required: [] },
                pageSize: { type: 'number', additionalProperties: false, required: [] },
                totalPage: { type: 'number', additionalProperties: false, required: [] },
                totalNumbers: { type: 'number', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: [],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/267'
            : '/document-service/api/rpc/method=queryDailyTradeReports',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['POST/document-service/api/rpc/method=queryDailyTradeReports']>;
    },

    /**
     * 接口名：删除中证协数据报告
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=268
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/document-service/api/rpc/method=removeDailyTradeReports': (
      req?: IModels['POST/document-service/api/rpc/method=removeDailyTradeReports']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                documentIds: {
                  type: 'array',
                  items: { type: ['string'] },
                  additionalProperties: false,
                  required: [],
                },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: ['method', 'params'],
        },
        response: { type: 'object', properties: {}, additionalProperties: false, required: [] },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/268'
            : '/document-service/api/rpc/method=removeDailyTradeReports',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['POST/document-service/api/rpc/method=removeDailyTradeReports']>;
    },

    /**
     * 接口名：下载中证协报告
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=269
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'GET/bct/downloadExtDoc': (
      req?: IModels['GET/bct/downloadExtDoc']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: { docId: { type: 'string', additionalProperties: false, required: [] } },
          additionalProperties: false,
          required: ['docId'],
        },
        response: { type: 'object', properties: {}, additionalProperties: false, required: [] },
      };

      return rapperFetch({
        url:
          extra && extra.mock ? 'http://10.1.5.117:38080/app/mock/data/269' : '/bct/downloadExtDoc',
        method: 'GET',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['GET/bct/downloadExtDoc']>;
    },

    /**
     * 接口名：上传中证协数据报告
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=270
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/document-service/api/upload/rpc/method=uploadDailyTradeReport': (
      req?: IModels['POST/document-service/api/upload/rpc/method=uploadDailyTradeReport']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            operator: {
              type: 'string',
              additionalProperties: false,
              required: [],
              description: '当前操作用户',
            },
            filename: { type: 'string', additionalProperties: false, required: [] },
          },
          additionalProperties: false,
          required: ['filename'],
        },
        response: { type: 'object', properties: {}, additionalProperties: false, required: [] },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/270'
            : '/document-service/api/upload/rpc/method=uploadDailyTradeReport',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<
        IResponseTypes['POST/document-service/api/upload/rpc/method=uploadDailyTradeReport']
      >;
    },

    /**
     * 接口名：查询分红信息
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=97&itf=286
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/trade-service/api/rpc?method=mktStockSearch': (
      req?: IModels['POST/trade-service/api/rpc?method=mktStockSearch']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: { type: 'object', properties: {}, additionalProperties: false, required: [] },
        response: { type: 'object', properties: {}, additionalProperties: false, required: [] },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/286'
            : '/trade-service/api/rpc?method=mktStockSearch',
        method: 'POST',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['POST/trade-service/api/rpc?method=mktStockSearch']>;
    },

    /**
     * 接口名：试结算
     * Rap 地址: http://10.1.5.117:3000/repository/editor?id=19&mod=105&itf=314
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'GET/trade-service/api/rpc/method=tradeExercisePreSettle': (
      req?: IModels['GET/trade-service/api/rpc/method=tradeExercisePreSettle']['Req'],
      extra?: commonLib.IExtra,
    ) => {
      const schemas: {
        request: commonLib.JSONSchema4;
        response: commonLib.JSONSchema4;
      } = {
        request: {
          type: 'object',
          properties: {
            method: { type: 'string', additionalProperties: false, required: [] },
            params: {
              type: 'object',
              properties: {
                userLoginId: { type: 'string', additionalProperties: false, required: [] },
                tradeId: { type: 'string', additionalProperties: false, required: [] },
                positionId: { type: 'string', additionalProperties: false, required: [] },
                eventDetail: {
                  type: 'object',
                  properties: {},
                  additionalProperties: false,
                  required: [],
                },
                eventType: { type: 'string', additionalProperties: false, required: [] },
              },
              additionalProperties: false,
              required: [],
            },
          },
          additionalProperties: false,
          required: [],
        },
        response: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', additionalProperties: false, required: [] },
            id: { type: 'string', additionalProperties: false, required: [] },
            result: { type: 'number', additionalProperties: false, required: [] },
          },
          additionalProperties: false,
          required: [],
        },
      };

      return rapperFetch({
        url:
          extra && extra.mock
            ? 'http://10.1.5.117:38080/app/mock/data/314'
            : '/trade-service/api/rpc/method=tradeExercisePreSettle',
        method: 'GET',
        params: req,
        schemas,
        extra,
      }) as Promise<IResponseTypes['GET/trade-service/api/rpc/method=tradeExercisePreSettle']>;
    },
  };
}
