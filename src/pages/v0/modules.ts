/**
 * 个人中心 · 模块注册表
 *
 * 侧栏导航、工作台模块卡片、最近访问三处共用这一份定义：
 * 新增一个控制台页面时，只需在这里登记一条，再到 router 里挂上组件，
 * 导航与工作台会自动出现对应入口，无需改动布局代码。
 */

export type ConsoleGroupId = 'overview' | 'account' | 'content' | 'ability' | 'tool' | 'admin'

/** 工作台指标项，与 overview.vue 中的统计请求一一对应 */
export type StatKey = 'articles' | 'favorites' | 'privates' | 'apis' | 'apps' | 'pnotes' | 'cards' | 'tasks'

export interface ConsoleGroup {
  id: ConsoleGroupId
  /** 侧栏分组标题 */
  label: string
  /** 工作台分组右侧的说明 */
  note: string
  /** 仅在工作台内出现，不进侧栏（工具类模块挂在「工作台」之下） */
  workbenchOnly?: boolean
}

export interface ConsoleModule {
  id: string
  /** 展示编号，等宽字体显示 */
  index: string
  name: string
  /** 一句话说明，工作台卡片与搜索都用它 */
  desc: string
  path: string
  group: ConsoleGroupId
  /** bootstrap-icons 类名 */
  icon: string
  /** 搜索关键词，补充名称与说明之外的别名 */
  keywords: string[]
  /** 仅管理员可见 */
  adminOnly?: boolean
  /** 关联指标，工作台卡片据此显示实时数量 */
  stat?: StatKey
  /** 无实时数量时的说明文字 */
  hint?: string
}

export const consoleGroups: ConsoleGroup[] = [
  {id: 'overview', label: '概览', note: '每天从这里开始'},
  {id: 'account', label: '账号', note: '身份与安全'},
  {id: 'content', label: '内容', note: '写过的东西'},
  {id: 'ability', label: '能力', note: '对外开放的部分'},
  {id: 'tool', label: '工具', note: '工作台内的小工具', workbenchOnly: true},
  {id: 'admin', label: '管理', note: '站点维护'},
]

export const consoleModules: ConsoleModule[] = [
  {
    id: 'workbench',
    index: '01',
    name: '工作台',
    desc: '指标、模块目录与常用工具的总入口',
    path: '/v0/workbench',
    group: 'overview',
    icon: 'bi-grid-1x2',
    keywords: ['工作台', '首页', '概览', 'dashboard', 'workbench'],
    hint: '当前所在'
  },
  {
    id: 'info',
    index: '02',
    name: '账号设置',
    desc: '头像、昵称、邮箱、QQ 绑定与密码',
    path: '/v0/info',
    group: 'account',
    icon: 'bi-person-gear',
    keywords: ['账号', '资料', '头像', '昵称', '邮箱', '密码', '绑定'],
    hint: '身份 · 安全'
  },
  {
    id: 'articles',
    index: '03',
    name: '文章管理',
    desc: '我的文章、收藏与私密记录',
    path: '/v0/articles',
    group: 'content',
    icon: 'bi-journal-text',
    keywords: ['文章', '帖子', '收藏', '私密', '内容'],
    stat: 'articles'
  },
  {
    id: 'aox',
    index: '04',
    name: '接口管理',
    desc: '对外公开的 API 清单与新增入口',
    path: '/v0/aox',
    group: 'ability',
    icon: 'bi-hdd-network',
    keywords: ['接口', 'api', '开放', '地址'],
    stat: 'apis'
  },
  {
    id: 'app',
    index: '05',
    name: '应用管理',
    desc: '第三方应用的 App ID 与密钥',
    path: '/v0/app',
    group: 'ability',
    icon: 'bi-box-seam',
    keywords: ['应用', 'app', '密钥', '授权', 'oauth'],
    stat: 'apps'
  },
  {
    id: 'pnote',
    index: '06',
    name: '密码本',
    desc: '账号密码的一页账本，悬停即改',
    path: '/v0/workbench/pnote',
    group: 'tool',
    icon: 'bi-key',
    keywords: ['密码', '密码本', '账号', '记事', 'pwd', 'note'],
    stat: 'pnotes'
  },
  {
    id: 'task',
    index: '07',
    name: '定时任务',
    desc: '按计划执行 JS 脚本，可配代理并留存日志',
    path: '/v0/workbench/task',
    group: 'tool',
    icon: 'bi-clock-history',
    keywords: ['定时', '任务', '脚本', 'js', 'cron', '代理', 'task', 'schedule'],
    stat: 'tasks'
  },
  {
    id: 'cardkey',
    index: '08',
    name: '卡密维护',
    desc: '卡号卡密的生成、检索与兑换状态',
    path: '/v0/workbench/cardkey',
    group: 'tool',
    icon: 'bi-shield-lock',
    keywords: ['卡密', '卡号', '兑换', '导入', 'cardkey'],
    adminOnly: true,
    stat: 'cards'
  },
  {
    id: 'adminv0',
    index: '09',
    name: '帖子维护',
    desc: '全站帖子的排序、状态与删除',
    path: '/v0/adminv0',
    group: 'admin',
    icon: 'bi-collection',
    keywords: ['帖子', '维护', '排序', '下架'],
    adminOnly: true,
    hint: '仅管理员'
  },
  {
    id: 'adminv1',
    index: '10',
    name: '一言维护',
    desc: '每日一言的增删与随机生成',
    path: '/v0/adminv1',
    group: 'admin',
    icon: 'bi-chat-quote',
    keywords: ['一言', '句子', '随机', 'yiyan'],
    adminOnly: true,
    hint: '仅管理员'
  },
  {
    id: 'adminai',
    index: '11',
    name: 'AI 配置',
    desc: '对话模型与密钥的后台设置',
    path: '/v0/adminai',
    group: 'admin',
    icon: 'bi-cpu',
    keywords: ['ai', '模型', '密钥', '配置', 'llm'],
    adminOnly: true,
    hint: '仅管理员'
  },
]

/** 是否为管理员 */
export function isAdmin(roles: string[]): boolean {
  return roles.includes('admin')
}

/** 当前角色可见的模块 */
export function visibleModules(roles: string[]): ConsoleModule[] {
  const admin = isAdmin(roles)
  return consoleModules.filter(m => !m.adminOnly || admin)
}

/** 侧栏导航：按分组组织，剔除仅工作台内出现的分组 */
export function navGroups(roles: string[]) {
  const list = visibleModules(roles)
  return consoleGroups
    .filter(g => !g.workbenchOnly)
    .map(g => ({...g, modules: list.filter(m => m.group === g.id)}))
    .filter(g => g.modules.length > 0)
}

/** 按路径反查模块，用于最近访问与标题推导 */
export function findModule(path: string): ConsoleModule | undefined {
  return consoleModules.find(m => m.path === path)
}
