import analysis from './zh-CN/analysis';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import monitor from './zh-CN/monitor';
import result from './zh-CN/result';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';

export default {
  'menu.testPage': 'testPage',
  'menu.testPageFormControls': 'testPageFormControls',
  'menu.dashboard': '控制面板',
  'menu.welcomePage': '欢迎页面',
  'menu.systemSettings': '系统设置',
  'menu.systemSettings.calendars': '交易日历',
  'menu.systemSettings.riskSettings': '风控设置',
  // 'menu.systemSettings.roles': '角色管理',
  'menu.systemSettings.roleManagement': '角色管理',
  'menu.systemSettings.users': '用户管理',
  'menu.systemSettings.department': '部门管理',
  'menu.systemSettings.resources': '数据权限管理',
  'menu.systemSettings.tradeBooks': '交易簿管理',
  'menu.systemSettings.volatilityCalendar': '波动率日历管理',
  'menu.systemSettings.documentManagement': '文档模板管理',
  'menu.pricingSettings': '定价管理',
  'menu.pricingSettings.volSurface': '波动率曲面',
  'menu.pricingSettings.riskFreeCurve': '无风险利率曲线',
  'menu.pricingSettings.dividendCurve': '分红/融券曲线',
  'menu.pricingSettings.pricingEnvironment': '定价设置',
  'menu.pricingSettings.customModel': '自定义模型',
  'menu.pricingSettings.baseContractManagement': '基础合约管理',
  'menu.riskManager': '风险管理',
  'menu.riskManager.intradayGreeks': '实时风险',
  'menu.riskManager.intradayPnl': '实时盈亏',
  'menu.riskManager.intradayPositionReport': '持仓明细',
  'menu.riskManager.intradayRiskByUnderlyerReport': '标的风险',
  'menu.riskManager.intradayDailyPnlByUnderlyerReport': '标的盈亏',
  'menu.riskManager.customReport': '定制化报告',
  'menu.riskManager.intradayExpiringPositionReport': '到期合约',
  'menu.riskManager.portfolioRisk': '投资组合风险',
  'menu.clientManagement': '客户管理',
  'menu.clientManagement.clientInfo': '客户信息管理',
  'menu.clientManagement.newClient': '客户信息管理二',
  'menu.clientManagement.salesManagement': '销售管理',
  'menu.clientManagement.fundStatistics': '客户资金统计',
  'menu.clientManagement.marginManagement': '保证金管理',
  'menu.clientManagement.discrepancyManagement': '财务出入金管理',
  'menu.clientManagement.valuationManagement': '客户估值报告',
  'menu.clientManagement.bankAccount': '银行账户管理',
  'menu.clientManagement.ioglodManagement': '台账管理',
  'menu.customSalesManage': '销售管理',
  'menu.customValuation': '客户估值',
  'menu.customInfo': '客户信息',
  // 'menu.bankAccount': '客户银行账户管理',
  'menu.tradeManagement': '交易管理',
  'menu.tradeManagement.booking': '交易录入',
  'menu.tradeManagement.contractManagement': '合约管理',
  'menu.tradeManagement.pricing': '交易定价',
  'menu.tradeManagement.notifications': '事件提醒',
  'menu.tradeManagement.bookEdit': '交易编辑',
  'menu.tradeManagement.marketManagement': '行情管理',
  'menu.tradeManagement.subjectStore': '标的物管理',
  'menu.tradeManagement.onBoardTransaction': '场内交易管理',
  'menu.tradeManagement.portfolioManagement': '投资组合管理',
  'menu.tradeManagement.tradeDocuments': '交易文档',
  'menu.tradeManagement.pricingManagement': '历史定价管理',
  'menu.workflowManagement': '审核',
  'menu.workflowManagement.workflowSettings': '审核配置',
  'menu.workflowManagement.processManagement': '任务管理',
  'menu.approvalProcess': '流程管理',
  'menu.approvalProcess.approvalProcessManagement': '我的审批单',
  'menu.approvalProcess.auditingManagement': '审批组管理',
  'menu.approvalProcess.processConfiguration': '审批流程配置',
  'menu.approvalProcess.triggerManagement': '触发器管理',
  'menu.reports': '报告',
  'menu.reports.spotLadder': '标的物情景分析',
  'menu.reports.pnlAttribution': '盈亏归因',
  'menu.reports.risk': '风险报告',
  'menu.reports.eodPosition': '持仓明细',
  'menu.reports.eodRiskByUnderlyer': '汇总风险',
  'menu.reports.eodDailyPnlByUnderlyer': '汇总日盈亏',
  'menu.reports.eodHistoricalPnlByUnderlyer': '历史盈亏',
  'menu.reports.tradingStatements': '交易报表',
  'menu.reports.fundsDetailedStatements': '资金明细报表',
  'menu.reports.customerFundsSummaryStatements': '客户资金汇总报表',
  'menu.reports.reportsCustomManagement': '自定义报告管理',
  'menu.userInfo': '个人中心',
  // pro lang
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'validation.email.required': '请输入邮箱地址！',
  'validation.email.wrong-format': '邮箱地址格式错误！',
  'validation.password.required': '请输入密码！',
  'validation.password.twice': '两次输入的密码不匹配!',
  'validation.password.strength.msg': '请至少输入 6 个字符。请不要使用容易被猜到的密码。',
  'validation.password.strength.strong': '强度：强',
  'validation.password.strength.medium': '强度：中',
  'validation.password.strength.short': '强度：太短',
  'validation.confirm-password.required': '请确认密码！',
  'validation.phone-number.required': '请输入手机号！',
  'validation.phone-number.wrong-format': '手机号格式错误！',
  'validation.verification-code.required': '请输入验证码！',
  'validation.title.required': '请输入标题',
  'validation.date.required': '请选择起止日期',
  'validation.goal.required': '请输入目标描述',
  'validation.standard.required': '请输入衡量标准',
  'form.optional': '（选填）',
  'form.submit': '提交',
  'form.save': '保存',
  'form.email.placeholder': '邮箱',
  'form.password.placeholder': '至少6位密码，区分大小写',
  'form.confirm-password.placeholder': '确认密码',
  'form.phone-number.placeholder': '位手机号',
  'form.verification-code.placeholder': '验证码',
  'form.title.label': '标题',
  'form.title.placeholder': '给目标起个名字',
  'form.date.label': '起止日期',
  'form.date.placeholder.start': '开始日期',
  'form.date.placeholder.end': '结束日期',
  'form.goal.label': '目标描述',
  'form.goal.placeholder': '请输入你的阶段性工作目标',
  'form.standard.label': '衡量标准',
  'form.standard.placeholder': '请输入衡量标准',
  'form.client.label': '客户',
  'form.client.label.tooltip': '目标的服务对象',
  'form.client.placeholder': '请描述你服务的客户，内部客户直接 @姓名／工号',
  'form.invites.label': '邀评人',
  'form.invites.placeholder': '请直接 @姓名／工号，最多可邀请 5 人',
  'form.weight.label': '权重',
  'form.weight.placeholder': '请输入',
  'form.public.label': '目标公开',
  'form.public.label.help': '客户、邀评人默认被分享',
  'form.public.radio.public': '公开',
  'form.public.radio.partially-public': '部分公开',
  'form.public.radio.private': '不公开',
  'form.publicUsers.placeholder': '公开给',
  'form.publicUsers.option.A': '同事甲',
  'form.publicUsers.option.B': '同事乙',
  'form.publicUsers.option.C': '同事丙',
  'component.globalHeader.search': '站内搜索',
  'component.globalHeader.search.example1': '搜索提示一',
  'component.globalHeader.search.example2': '搜索提示二',
  'component.globalHeader.search.example3': '搜索提示三',
  'component.globalHeader.help': '使用文档',
  'component.globalHeader.notification': '通知',
  'component.globalHeader.notification.empty': '你已查看所有通知',
  'component.globalHeader.message': '消息',
  'component.globalHeader.message.empty': '您已读完所有消息',
  'component.globalHeader.event': '待办',
  'component.globalHeader.event.empty': '你已完成所有待办',
  'component.noticeIcon.clear': '清空',
  'component.noticeIcon.cleared': '清空了',
  'component.noticeIcon.empty': '暂无数据',
  'menu.home': '首页',
  'menu.dashboard.analysis': '分析页',
  'menu.dashboard.monitor': '监控页',
  'menu.dashboard.workplace': '工作台',
  'menu.form': '表单页',
  'menu.form.basicform': '基础表单',
  'menu.form.stepform': '分步表单',
  'menu.form.stepform.info': '分步表单（填写转账信息）',
  'menu.form.stepform.confirm': '分步表单（确认转账信息）',
  'menu.form.stepform.result': '分步表单（完成）',
  'menu.form.advancedform': '高级表单',
  'menu.list': '列表页',
  'menu.list.searchtable': '查询表格',
  'menu.list.basiclist': '标准列表',
  'menu.list.cardlist': '卡片列表',
  'menu.list.searchlist': '搜索列表',
  'menu.list.searchlist.articles': '搜索列表（文章）',
  'menu.list.searchlist.projects': '搜索列表（项目）',
  'menu.list.searchlist.applications': '搜索列表（应用）',
  'menu.profile': '详情页',
  'menu.profile.basic': '基础详情页',
  'menu.profile.advanced': '高级详情页',
  'menu.result': '结果页',
  'menu.result.success': '成功页',
  'menu.result.fail': '失败页',
  'menu.exception': '异常页',
  'menu.exception.not-permission': '403',
  'menu.exception.not-find': '404',
  'menu.exception.server-error': '500',
  'menu.exception.trigger': '触发错误',
  'menu.account': '个人页',
  'menu.account.center': '个人中心',
  'menu.account.settings': '个人设置',
  'menu.account.trigger': '触发报错',
  'menu.account.logout': '退出登录',
  'menu.account.update': '修改密码',
  'app.login.message-invalid-credentials': '账户或密码错误（admin/888888）',
  'app.login.message-invalid-verification-code': '验证码错误',
  'app.login.tab-login-credentials': '账户密码登录',
  'app.login.tab-login-mobile': '手机号登录',
  'app.login.remember-me': '自动登录',
  'app.login.forgot-password': '忘记密码',
  'app.login.sign-in-with': '其他登录方式',
  'app.login.signup': '注册账户',
  'app.login.login': '登录',
  'app.register.register': '注册',
  'app.register.get-verification-code': '获取验证码',
  'app.register.sing-in': '使用已有账户登录',
  'app.register-result.msg': '你的账户：{email} 注册成功',
  'app.register-result.activation-email':
    '激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。',
  'app.register-result.back-home': '返回首页',
  'app.register-result.view-mailbox': '查看邮箱',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
};
