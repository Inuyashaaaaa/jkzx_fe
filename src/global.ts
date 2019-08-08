/* eslint-disable */
import 'animate.css';
import BigNumber from 'bignumber.js';
import { setAutoFreeze } from 'immer';
import numeral from 'numeral';
import { connectSocket, disconnectSocket } from '@/services/socket';

const userData = {
  expired: false,
  code: '0',
  roles: ['all_page'],
  locked: false,
  loginStatus: true,
  message: '登录成功',
  userId: 'ec477c8c-ddac-4182-9b2b-2cd80de5a2f2',
  username: 'trader1',
  token:
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cmFkZXIxIiwicm9sZXMiOlsiYWxsX3BhZ2UiXSwiaXNzIjoidG9uZ3l1LnRlY2giLCJleHAiOjE1NzMwMjQ0NjYyMDcsImlhdCI6MTU2NTI0ODQ2NjIwNywidXNlcm5hbWUiOiJ0cmFkZXIxIn0.LMBtqCRUu_cYnZhu9bXJtYQugBsRK7ygOEnT2UX-zYk',
  permissions: {
    welcomePage: true,
    default: true,
    help: true,
    userInfo: true,
    clientManagement: true,
    valuationManagement: true,
    salesManagement: true,
    fundStatistics: true,
    marginManagement: true,
    bankAccount: true,
    ioglodManagement: true,
    discrepancyManagement: true,
    clientInfo: true,
    reports: true,
    reportsCustomManagement: true,
    eodHistoricalPnlByUnderlyer: true,
    tradingStatements: true,
    eodPosition: true,
    eodRiskByUnderlyer: true,
    customerFundsSummaryStatements: true,
    eodDailyPnlByUnderlyer: true,
    fundsDetailedStatements: true,
    spotLadder: true,
    tradeManagement: true,
    onBoardTransaction: true,
    contractManagement: true,
    subjectStore: true,
    bookEdit: true,
    notifications: true,
    booking: true,
    marketManagement: true,
    tradeDocuments: true,
    pricing: true,
    pricingManagement: true,
    portfolioManagement: true,
    dashboard: true,
    customValuation: true,
    pricingSettings: true,
    baseContractManagement: true,
    dividendCurve: true,
    pricingEnvironment: true,
    riskFreeCurve: true,
    volSurface: true,
    customModel: true,
    systemSettings: true,
    roleManagement: true,
    riskSettings: true,
    users: true,
    volatilityCalendar: true,
    resources: true,
    tradeBooks: true,
    calendars: true,
    documentManagement: true,
    department: true,
    customInfo: true,
    approvalProcess: true,
    approvalProcessManagement: true,
    processConfiguration: true,
    auditingManagement: true,
    triggerManagement: true,
    customSalesManage: true,
    workflowManagement: true,
    workflowSettings: true,
    processManagement: true,
    riskManager: true,
    intradayExpiringPositionReport: true,
    intradayRiskByUnderlyerReport: true,
    portfolioRisk: true,
    intradayPositionReport: true,
    customReport: true,
    intradayDailyPnlByUnderlyerReport: true,
  },
};

window.localStorage.setItem('tongyu_USER_LOCAL_FIELD', JSON.stringify(userData));

numeral.register('format', 'de', {
  regexps: {
    format: /(de)/,
    unformat: /(de)/,
  },
  format: (value, format, roundingFunction) => {
    // const space = numeral._.includes(format, ' de') ? ' ' : '';

    format = format.replace(/\s?de/, '');

    if (String(value).indexOf('e') !== -1) {
      const val = parseFloat(new BigNumber(value).decimalPlaces(4).toString(10));
      const isnan = Number.isNaN(val);
      if (isnan) {
        console.error('de: parse value error: val is not Number.');
      }
      value = isnan ? 0 : val;
    }

    return `${numeral._.numberToFormat(value, format, roundingFunction)}`;
  },
  unformat: str => numeral._.stringToNumber(str),
});

numeral.register('format', 'pe', {
  regexps: {
    format: /(pe)/,
    unformat: /(pe)/,
  },
  format: (value, format, roundingFunction) => {
    const space = numeral._.includes(format, ' pe') ? ' ' : '';

    format = format.replace(/\s?pe/, '');

    if (String(value).indexOf('e') !== -1) {
      const val = parseFloat(new BigNumber(value).decimalPlaces(4).toString(10));
      const isnan = Number.isNaN(val);
      if (isnan) {
        console.error('pe: parse value error: val is not Number.');
      }
      value = isnan ? 0 : val;
    }

    return `${numeral._.numberToFormat(value, format, roundingFunction)}${space} %`;
  },
  unformat: str => numeral._.stringToNumber(str),
});

numeral.register('format', 'pde', {
  regexps: {
    format: /(pde)/,
    unformat: /(pde)/,
  },
  format: (value, format, roundingFunction) => {
    const space = numeral._.includes(format, ' pde') ? ' ' : '';

    format = format.replace(/\s?%e/, '');

    if (String(value).indexOf('e') !== -1) {
      const val = parseFloat(new BigNumber(value).decimalPlaces(4).toString(10));
      const isnan = Number.isNaN(val);
      if (isnan) {
        console.error('pde: parse value error: val is not Number.');
      }
      value = isnan ? 0 : val;
    }

    value = new BigNumber(value).multipliedBy(100).toNumber();

    return `${numeral._.numberToFormat(value, format, roundingFunction)}${space} %`;
  },
  unformat: str => new BigNumber(numeral._.stringToNumber(str)).div(100).toNumber(),
});

numeral.register('format', '¥', {
  regexps: {
    format: /(¥)/,
    unformat: /(¥)/,
  },
  format: (value, format, roundingFunction) => {
    const space = numeral._.includes(format, ' ¥') ? ' ' : '';
    const start = format.startsWith('¥');

    format = format.replace(/\s?¥/, '');

    if (String(value).indexOf('e') !== -1) {
      const val = parseFloat(new BigNumber(value).decimalPlaces(4).toString(10));
      const isnan = Number.isNaN(val);
      if (isnan) {
        console.error('parse value error: val is not Number.');
      }
      value = isnan ? 0 : val;
    }

    return `${start ? '¥ ' : ''}${numeral._.numberToFormat(
      value,
      format,
      roundingFunction,
    )}${space}${!start ? ' ¥' : ''}`;
  },
  unformat: str => numeral._.stringToNumber(str),
});

numeral.register('format', 'days', {
  regexps: {
    format: /(days)/,
    unformat: /(days)/,
  },
  format: (value, format, roundingFunction) => {
    const space = numeral._.includes(format, ' days') ? ' ' : '';

    format = format.replace(/\s?days/, '');

    return `${numeral._.numberToFormat(value, format, roundingFunction)}${space}天`;
  },
  unformat: str => numeral._.stringToNumber(str),
});

numeral.register('format', 'ss', {
  regexps: {
    format: /(ss)/,
    unformat: /(ss)/,
  },
  format: (value, format, roundingFunction) => {
    const space = numeral._.includes(format, ' ss') ? ' ' : '';

    format = format.replace(/\s?ss/, '');

    return `${numeral._.numberToFormat(value, format, roundingFunction)}${space}手`;
  },
  unformat: str => numeral._.stringToNumber(str),
});

const startSocket = () => {
  const socketHost = `${window.location.protocol}//${
    process.env.NODE_ENV === 'development' ? '10.1.100.219' : window.location.hostname
  }`;

  connectSocket({
    address: `${socketHost}:16000/ws-end-point`,
    notificationChannel: '/topic-report/notify',
  });
  window.addEventListener('beforeunload', () => {
    disconnectSocket();
  });
};

const start = () => {
  setAutoFreeze(false);
  startSocket();
};

start();
// // Notify user if offline now
// window.addEventListener('sw.offline', () => {
//   message.warning(formatMessage({ id: 'app.pwa.offline' }));
// });

// // Pop up a prompt on the page asking the user if they want to use the latest version
// window.addEventListener('sw.updated', e => {
//   Modal.confirm({
//     title: formatMessage({ id: 'app.pwa.serviceworker.updated' }),
//     content: formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
//     okText: formatMessage({ id: 'app.pwa.serviceworker.updated.ok' }),
//     onOk: async () => {
//       // Check if there is sw whose state is waiting in ServiceWorkerRegistration
//       // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
//       const worker = e.detail && e.detail.waiting;
//       if (!worker) {
//         return Promise.resolve();
//       }
//       // Send skip-waiting event to waiting SW with MessageChannel
//       await new Promise((resolve, reject) => {
//         const channel = new MessageChannel();
//         channel.port1.onmessage = event => {
//           if (event.data.error) {
//             reject(event.data.error);
//           } else {
//             resolve(event.data);
//           }
//         };
//         worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
//       });
//       // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
//       window.location.reload(true);
//       return true;
//     },
//   });
// });
