<style scoped>
/* =============================================
   待办：渠道绑定 → 筛选 → 时间轴日程 → 编辑/记录
   ============================================= */

.tool-bar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-4);
}

.tool-hint {
  margin: 0;
  max-width: 54em;
  font-size: var(--text-xs);
  line-height: 1.8;
  color: var(--ink-3);
}

.tool-actions {
  display: flex;
  align-items: center;
  gap: var(--gap-3);
}

.tool-count {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
  white-space: nowrap;
}

/* ---- 提醒渠道 ---- */
.channels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
  gap: var(--gap-3);
  margin-bottom: var(--gap-5);
}

.channel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 13px 15px 12px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  background: var(--glass-thin);
}

.channel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  color: var(--ink);
}

.channel-head i {
  font-size: 13px;
  color: var(--seal);
}

.channel-head .chip {
  margin-left: auto;
}

.channel-body {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  color: var(--ink-2);
  word-break: break-all;
}

.channel-body.is-off {
  color: var(--ink-3);
}

.channel-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  color: var(--ink-2);
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.link:hover {
  color: var(--seal);
}

.link:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.link--danger:hover {
  color: var(--color-danger);
}

/* ---- 筛选 ---- */
.filters {
  display: flex;
  align-items: center;
  gap: var(--gap-4);
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: var(--gap-2);
}

.filter {
  position: relative;
  padding: 0 0 9px;
  border: 0;
  background: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  letter-spacing: 0.03em;
  color: var(--ink-3);
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.filter::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--seal);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--dur) var(--ease);
}

.filter:hover {
  color: var(--ink);
}

.filter.on {
  color: var(--seal);
}

.filter.on::after {
  transform: scaleX(1);
}

.filter .n {
  margin-left: 5px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

/* ---- 时间轴日程 ---- */
.schedule {
  margin: 0;
  padding: 0;
  list-style: none;
}

.slot {
  display: grid;
  grid-template-columns: 74px 16px minmax(0, 1fr);
  gap: var(--gap-3);
  align-items: stretch;
}

.slot-when {
  padding-top: 13px;
  text-align: right;
  font-family: var(--font-mono);
}

.slot-day {
  display: block;
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

.slot-clock {
  display: block;
  margin-top: 2px;
  font-size: var(--text-md);
  letter-spacing: 0.02em;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}

.slot-rail {
  position: relative;
}

.slot-rail::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--rule);
}

.slot:first-child .slot-rail::before {
  top: 17px;
}

.slot:last-child .slot-rail::before {
  bottom: calc(100% - 17px);
}

.slot-dot {
  position: absolute;
  top: 17px;
  left: 50%;
  width: 7px;
  height: 7px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: var(--seal);
  box-shadow: 0 0 0 3px var(--seal-wash);
}

.slot.is-soon .slot-dot {
  animation: todo-pulse 1.8s var(--ease) infinite;
}

.slot.is-expired .slot-dot {
  background: var(--ink-3);
  box-shadow: none;
}

.slot.is-done .slot-dot {
  background: transparent;
  border: 1px solid #2f7d5c;
  box-shadow: 0 0 0 3px rgba(47, 125, 92, 0.12);
}

@keyframes todo-pulse {
  50% {
    box-shadow: 0 0 0 7px rgba(192, 57, 43, 0.1);
  }
}

.slot-card {
  margin-bottom: var(--gap-2);
  padding: 12px 15px 10px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  background: var(--glass-thin);
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.slot-card:hover {
  border-color: rgba(192, 57, 43, 0.24);
  background: var(--glass);
}

.slot.is-expired .slot-card {
  opacity: 0.72;
}

.slot.is-done .slot-card {
  opacity: 0.62;
}

.item-head {
  display: flex;
  align-items: center;
  gap: 9px;
}

.item-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ink);
}

.slot.is-done .item-title {
  text-decoration: line-through;
  text-decoration-color: var(--ink-3);
  color: var(--ink-3);
}

.item-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 7px 0 0;
  font-size: var(--text-xs);
  line-height: 1.7;
  color: var(--ink-2);
  white-space: pre-wrap;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 9px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

.item-meta .remain {
  color: var(--ink-2);
}

.item-meta i {
  margin-right: 4px;
}

.item-meta .remain.is-soon {
  color: var(--seal);
}

.item-meta .remain.is-over {
  color: var(--color-danger);
}

.item-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 9px;
}

.item-chips .chip i {
  margin-right: 4px;
  font-size: 10px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--rule);
}

.spacer {
  flex: 1;
}

/* ---- 勾选框 ---- */
.check {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid var(--rule-2);
  border-radius: 50%;
  background: transparent;
  color: transparent;
  font-size: 10px;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease),
    color var(--dur) var(--ease);
}

.check:hover {
  border-color: var(--seal);
  color: var(--seal);
}

.check.on {
  border-color: #2f7d5c;
  background: #2f7d5c;
  color: #fff;
}

/* ---- 空态 ---- */
.empty-box {
  padding: var(--gap-7) var(--gap-4);
  border: 1px dashed var(--rule-2);
  border-radius: var(--r-md);
  text-align: center;
}

.empty-box strong {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-md);
  color: var(--ink-2);
}

.empty-box span {
  display: block;
  margin-top: 6px;
  font-size: var(--text-sm);
  color: var(--ink-3);
}

/* ---- 弹窗通用 ---- */
.dlg-head {
  display: flex;
  align-items: baseline;
  gap: var(--gap-3);
  min-width: 0;
  padding-right: 18px;
}

.dlg-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ink);
  white-space: nowrap;
}

.dlg-sub {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.field {
  margin-bottom: var(--gap-4);
}

.field > label {
  display: block;
  margin-bottom: 7px;
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  color: var(--ink-2);
}

.field-row {
  display: flex;
  align-items: center;
  gap: var(--gap-3);
  flex-wrap: wrap;
}

.hint {
  margin: 7px 0 0;
  font-size: var(--text-2xs);
  line-height: 1.7;
  color: var(--ink-3);
}

/* ---- 通知方式选择 ---- */
.ways {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: var(--gap-2);
}

.way {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-sm);
  background: var(--paper-2);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.way:hover {
  border-color: rgba(192, 57, 43, 0.28);
}

.way.on {
  border-color: rgba(192, 57, 43, 0.42);
  background: var(--seal-wash);
}

.way:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ways--compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.way-mark {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  border: 1px solid var(--rule-2);
  border-radius: 4px;
  background: var(--paper-3);
  color: transparent;
  font-size: 10px;
  transition: all var(--dur) var(--ease);
}

.way.on .way-mark {
  border-color: var(--seal);
  background: var(--seal);
  color: #fff;
}

.way-text {
  min-width: 0;
}

.way-name {
  display: block;
  font-size: var(--text-sm);
  color: var(--ink);
}

.way-note {
  display: block;
  margin-top: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.02em;
  color: var(--ink-3);
  word-break: break-all;
}

/* ---- 提醒计划 ---- */
.plan {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: 6px;
  padding: 12px 6px 10px;
  border: 1px dashed var(--rule-2);
  border-radius: var(--r-sm);
  background: var(--paper-2);
}

.plan-node {
  position: relative;
  padding: 0 8px;
  text-align: center;
}

.plan-node::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--rule);
}

.plan-node:first-child::before {
  left: 50%;
}

.plan-node:last-child::before {
  right: 50%;
}

.plan-dot {
  position: relative;
  z-index: 1;
  display: block;
  width: 7px;
  height: 7px;
  margin: 0 auto 7px;
  border-radius: 50%;
  background: var(--seal);
  box-shadow: 0 0 0 3px var(--seal-wash);
}

.plan-time {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  color: var(--ink-2);
}

.plan-note {
  display: block;
  margin-top: 2px;
  font-size: var(--text-2xs);
  color: var(--ink-3);
}

/* ---- 绑定码 ---- */
.bind-intro {
  margin: 0 0 var(--gap-4);
  font-size: var(--text-sm);
  line-height: 1.85;
  color: var(--ink-2);
}

.bind-steps {
  margin: 0 0 var(--gap-4);
  padding: 0 0 0 18px;
  font-size: var(--text-xs);
  line-height: 2;
  color: var(--ink-3);
}

.code-card {
  padding: 18px 16px 14px;
  border: 1px solid rgba(192, 57, 43, 0.28);
  border-radius: var(--r-md);
  background: var(--seal-wash);
  text-align: center;
}

.code-value {
  display: block;
  font-family: var(--font-mono);
  font-size: 38px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-indent: 0.32em;
  color: var(--seal);
  font-variant-numeric: tabular-nums;
}

.code-note {
  margin: 8px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

.code-actions {
  display: flex;
  justify-content: center;
  gap: var(--gap-3);
  margin-top: 12px;
}

.bind-ok {
  padding: 20px 16px;
  border: 1px solid rgba(47, 125, 92, 0.28);
  border-radius: var(--r-md);
  background: rgba(47, 125, 92, 0.08);
  text-align: center;
}

.bind-ok strong {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-md);
  color: #2f7d5c;
}

.bind-ok span {
  display: block;
  margin-top: 5px;
  font-size: var(--text-xs);
  color: var(--ink-3);
}

/* ---- 通知记录 ---- */
.log-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-3);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: var(--gap-3);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

.log-row {
  display: grid;
  grid-template-columns: 62px 1fr 1fr auto;
  gap: 10px;
  align-items: baseline;
  padding: 9px 0;
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-2);
}

.log-row .ok {
  color: #2f7d5c;
}

.log-row .bad {
  color: var(--color-danger);
}

.log-msg {
  margin: 2px 0 8px;
  font-size: var(--text-2xs);
  line-height: 1.6;
  color: var(--ink-3);
  word-break: break-all;
}

@media (max-width: 640px) {
  .slot {
    grid-template-columns: 12px minmax(0, 1fr);
    gap: 10px;
  }

  .slot-when {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 0 0 4px;
    text-align: left;
  }

  .slot-day,
  .slot-clock {
    display: inline;
    margin: 0;
    font-size: var(--text-xs);
  }

  .slot-rail {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .slot-card {
    grid-column: 2;
    grid-row: 2;
  }

  .plan {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px 12px;
  }

  .plan-node {
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
  }

  .plan-node::before {
    display: none;
  }

  .plan-dot {
    margin: 0;
  }

  .plan-time {
    min-width: 74px;
  }

  .plan-note {
    margin: 0;
  }
}
</style>

<template>
  <div class="tool">
    <div class="tool-bar">
      <p class="tool-hint">
        一条待办就是时间轴上的一个点。临近时按你勾选的渠道提醒三次：24 小时前、2 小时前、30 分钟前；
        完成或过期后提醒自动停止。绑定 QQ 机器人后，也可在群里发「待办 交房租 24」快速创建，默认 12 小时后。
      </p>
      <div class="tool-actions">
        <span class="tool-count">{{ counts.pending }} 项进行中</span>
        <button class="btn btn--sm btn--seal" type="button" @click="openCreate">新建待办</button>
      </div>
    </div>

    <!-- 提醒渠道：收件目标来自账号里已完成的绑定 -->
    <section class="channels" aria-label="提醒渠道">
      <article class="channel">
        <div class="channel-head">
          <i class="bi bi-envelope-at"></i>
          QQ 邮箱
          <span class="chip" :class="bind.emailBound ? 'chip--ok' : ''">
            {{ bind.emailBound ? '已绑定' : '未绑定' }}
          </span>
        </div>
        <p class="channel-body" :class="{'is-off': !bind.emailBound}">
          {{ bind.emailBound ? bind.email : '绑定邮箱后，提醒会发送到该地址' }}
        </p>
        <div class="channel-foot">
          <RouterLink v-if="!bind.emailBound" to="/v0/info" class="link">去账号设置绑定</RouterLink>
          <span v-else class="hint" style="margin: 0">邮件由系统统一发出，无需重复填写</span>
        </div>
      </article>

      <article class="channel">
        <div class="channel-head">
          <i class="bi bi-robot"></i>
          QQ 机器人
          <span class="chip" :class="bind.qbotBound ? 'chip--ok' : ''">
            {{ bind.qbotBound ? '已绑定' : '未绑定' }}
          </span>
        </div>
        <p class="channel-body" :class="{'is-off': !bind.qbotBound}">
          {{ !bind.qbotAvailable
            ? '系统未接入机器人，暂时无法使用群提醒'
            : (bind.qbotBound ? boundText : '绑定后，提醒会发到你指定的群并 @ 你') }}
        </p>
        <div class="channel-foot">
          <button class="link" type="button" :disabled="!bind.qbotAvailable" @click="openBind">
            {{ bind.qbotBound ? '重新绑定' : '生成绑定码' }}
          </button>
          <button v-if="bind.qbotBound" class="link link--danger" type="button" @click="unbind">解除绑定</button>
        </div>
      </article>
    </section>

    <!-- 状态筛选 -->
    <div class="filters" role="tablist" aria-label="待办状态">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="filter"
        :class="{on: filter === tab.value}"
        type="button"
        role="tab"
        :aria-selected="filter === tab.value"
        @click="changeFilter(tab.value)"
      >
        {{ tab.label }}<span class="n">{{ tabCount(tab.value) }}</span>
      </button>
    </div>

    <div v-if="loading" class="empty-box">
      <strong>正在读取待办</strong>
      <span>稍候片刻。</span>
    </div>

    <div v-else-if="visibleTodos.length === 0" class="empty-box">
      <strong>{{ emptyTitle }}</strong>
      <span>{{ emptyHint }}</span>
    </div>

    <ul v-else class="schedule">
      <li
        v-for="todo in visibleTodos"
        :key="todo.id"
        class="slot"
        :class="slotClass(todo)"
      >
        <div class="slot-when" :title="fmtFull(todo.eventTime)">
          <span class="slot-day">{{ dayText(todo.eventTime) }}</span>
          <span class="slot-clock">{{ clockText(todo.eventTime) }}</span>
        </div>
        <div class="slot-rail"><span class="slot-dot"></span></div>

        <article class="slot-card">
          <header class="item-head">
            <button
              class="check"
              :class="{on: todo.finished === 1}"
              type="button"
              :aria-label="todo.finished === 1 ? '标记未完成' : '标记完成'"
              :title="todo.finished === 1 ? '标记未完成' : '标记完成'"
              @click="toggleFinished(todo)"
            >
              <i class="bi bi-check-lg"></i>
            </button>
            <h3 class="item-title" :title="todo.title">{{ todo.title }}</h3>
            <span v-if="todo.finished === 1" class="chip chip--ok">已完成</span>
            <span v-else-if="todo.expired === 1" class="chip">已过期</span>
            <span v-else-if="isSoon(todo)" class="chip chip--seal">即将开始</span>
          </header>

          <p v-if="todo.description" class="item-desc">{{ todo.description }}</p>

          <div class="item-meta">
            <span><i class="bi bi-calendar-event"></i> {{ fmtFull(todo.eventTime) }}</span>
            <span class="remain" :class="remainClass(todo)">{{ remainText(todo) }}</span>
            <span v-if="todo.createTime"><i class="bi bi-clock"></i>建于 {{ dayText(todo.createTime) }}</span>
          </div>

          <div class="item-chips">
            <span v-if="todo.notifyEmail === 1" class="chip"><i class="bi bi-envelope"></i>邮箱</span>
            <span v-if="todo.notifyBot === 1" class="chip"><i class="bi bi-robot"></i>QQ 群</span>
            <span v-if="todo.notifyEmail !== 1 && todo.notifyBot !== 1" class="chip">仅站内记录</span>
            <span v-if="todo.notifyEmail === 1 || todo.notifyBot === 1" class="chip">提醒 24h · 2h · 30m</span>
          </div>

          <footer class="item-actions">
            <button class="link" type="button" @click="openLogs(todo)">提醒记录</button>
            <button class="link" type="button" @click="openEdit(todo)">编辑</button>
            <span class="spacer"></span>
            <button class="link link--danger" type="button" @click="remove(todo)">删除</button>
          </footer>
        </article>
      </li>
    </ul>

    <!-- 新建 / 编辑 -->
    <el-dialog
      v-model="editorOpen"
      width="min(640px, 94vw)"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header>
        <div class="dlg-head">
          <h2 class="dlg-title">{{ editingId ? '编辑待办' : '新建待办' }}</h2>
          <span class="dlg-sub">{{ formSummary }}</span>
        </div>
      </template>

      <section class="field">
        <label for="todo-title">事件名</label>
        <el-input
          id="todo-title"
          v-model="form.title"
          maxlength="128"
          show-word-limit
          placeholder="例如：提交论文初稿"
        />
      </section>

      <section class="field">
        <label>事件时间点</label>
        <el-date-picker
          v-model="form.eventTime"
          type="datetime"
          value-format="x"
          format="YYYY-MM-DD HH:mm"
          placeholder="选择日期与时间"
          :clearable="false"
          :disabled-date="disabledDate"
          style="width: 100%"
        />
        <p class="hint">按这个时间点倒推三次提醒；时间一过，待办会自动标记为已过期。</p>
      </section>

      <section class="field">
        <label for="todo-desc">事件描述<span class="hint" style="display: inline; margin-left: 6px">可选</span></label>
        <el-input
          id="todo-desc"
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="1024"
          show-word-limit
          placeholder="补充地点、材料或注意事项"
        />
      </section>

      <section class="field">
        <label>状态</label>
        <div class="ways ways--compact">
          <button
            class="way"
            :class="{on: form.finished === 0}"
            type="button"
            @click="form.finished = 0"
          >
            <span class="way-mark"><i class="bi bi-check-lg"></i></span>
            <span class="way-text">
              <span class="way-name">未完成</span>
              <span class="way-note">按时间节点提醒</span>
            </span>
          </button>

          <button
            class="way"
            :class="{on: form.finished === 1}"
            type="button"
            @click="form.finished = 1"
          >
            <span class="way-mark"><i class="bi bi-check-lg"></i></span>
            <span class="way-text">
              <span class="way-name">已完成</span>
              <span class="way-note">提前勾选，立即停止提醒</span>
            </span>
          </button>
        </div>
      </section>

      <section class="field">
        <label>通知方式</label>
        <div class="ways">
          <button
            class="way"
            :class="{on: form.notifyEmail === 1}"
            type="button"
            :disabled="!bind.emailBound"
            @click="toggleWay('email')"
          >
            <span class="way-mark"><i class="bi bi-check-lg"></i></span>
            <span class="way-text">
              <span class="way-name">QQ 邮箱</span>
              <span class="way-note">
                {{ bind.emailBound ? bind.email : '未绑定邮箱，先到账号设置绑定' }}
              </span>
            </span>
          </button>

          <button
            class="way"
            :class="{on: form.notifyBot === 1}"
            type="button"
            :disabled="!bind.qbotAvailable || !bind.qbotBound"
            @click="toggleWay('bot')"
          >
            <span class="way-mark"><i class="bi bi-check-lg"></i></span>
            <span class="way-text">
              <span class="way-name">QQ 机器人</span>
              <span class="way-note">
                {{ !bind.qbotAvailable ? '系统未接入机器人' : (bind.qbotBound ? '发送到已绑定的群并 @ 你' : '未绑定，先在上方生成绑定码') }}
              </span>
            </span>
          </button>
        </div>
        <p class="hint">两条渠道可以同时选择；都不选时只作为站内待办记录。</p>
      </section>

      <section class="field" style="margin-bottom: 0">
        <label>提醒计划</label>
        <div class="plan">
          <div class="plan-node">
            <span class="plan-dot"></span>
            <span class="plan-time">24 小时前</span>
            <span class="plan-note">第一次</span>
          </div>
          <div class="plan-node">
            <span class="plan-dot"></span>
            <span class="plan-time">2 小时前</span>
            <span class="plan-note">第二次</span>
          </div>
          <div class="plan-node">
            <span class="plan-dot"></span>
            <span class="plan-time">30 分钟前</span>
            <span class="plan-note">第三次</span>
          </div>
        </div>
        <p class="hint">
          {{ form.finished === 1
            ? '当前为已完成状态，保存后不会发送任何提醒，仅保留记录。'
            : '共三次，发给上方勾选的每个渠道；创建或修改时间后按新时间重新计算。' }}
        </p>
      </section>

      <template #footer>
        <div class="channel-foot" style="justify-content: flex-end">
          <button class="btn btn--sm" type="button" @click="editorOpen = false">取消</button>
          <button class="btn btn--sm btn--seal" type="button" :disabled="saving" @click="save">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- QQ 机器人绑定 -->
    <el-dialog
      v-model="bindOpen"
      width="min(460px, 94vw)"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header>
        <div class="dlg-head">
          <h2 class="dlg-title">绑定 QQ 机器人</h2>
          <span class="dlg-sub">6 位码 · 10 分钟有效</span>
        </div>
      </template>

      <div v-if="bind.qbotBound" class="bind-ok">
        <strong>已绑定</strong>
        <span>{{ boundText }}</span>
        <div class="code-actions">
          <button class="btn btn--sm" type="button" @click="rebind">重新绑定</button>
        </div>
      </div>

      <template v-else>
        <p class="bind-intro">把下面这 6 位数字发到机器人所在的任意群，系统会自动记录这个群和你，之后的提醒会发到该群并 @ 你。</p>
        <ol class="bind-steps">
          <li>打开 QQ，进入机器人已加入的群；</li>
          <li>直接发送这 6 位数字，不需要 @ 机器人；</li>
          <li>看到机器人在群里回复「绑定成功」即可；</li>
          <li>之后可在群里发「待办 交房租 24」创建待办，不写小时数默认 12 小时。</li>
        </ol>

        <div class="code-card">
          <span class="code-value">{{ bindCode || '······' }}</span>
          <p class="code-note">{{ bindCountdown }}</p>
          <div class="code-actions">
            <button class="btn btn--sm" type="button" :disabled="!bindCode" @click="copyCode">复制</button>
            <button class="btn btn--sm btn--ghost" type="button" @click="renewCode">重新生成</button>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="channel-foot" style="justify-content: flex-end">
          <button class="btn btn--sm" type="button" @click="bindOpen = false">关闭</button>
        </div>
      </template>
    </el-dialog>

    <!-- 通知记录 -->
    <el-drawer v-model="logsOpen" :title="`${logTodo?.title || ''} · 提醒记录`" size="min(540px, 96vw)" append-to-body>
      <div class="log-summary">
        <span>共 {{ logs.length }} 条 · 每个阶段每个渠道最多成功一次</span>
        <button class="link" type="button" @click="refreshLogs">刷新</button>
      </div>

      <div v-if="logs.length === 0" class="empty-box">
        <strong>还没有发送记录</strong>
        <span>进入 24 小时窗口并触发第一次提醒后，这里会出现结果。</span>
      </div>

      <template v-else>
        <div v-for="log in logs" :key="log.id">
          <div class="log-row">
            <span>{{ stageLabel(log.stage) }}</span>
            <span>{{ channelLabel(log.channel) }}</span>
            <span :class="log.state === 1 ? 'ok' : 'bad'">{{ log.state === 1 ? '成功' : '失败' }}</span>
            <span>{{ fmtFull(log.sendTime) }}</span>
          </div>
          <p v-if="log.message" class="log-msg">{{ log.message }}</p>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import {RouterLink} from 'vue-router'
import {ElMessageBox} from 'element-plus'
import service from '@/axios'
import {toast} from '@/utils/utils'

interface Todo {
  id: number
  title: string
  description?: string | null
  eventTime: number
  expired: number
  finished: number
  notifyEmail: number
  notifyBot: number
  createTime?: number
}

interface NotifyLog {
  id: number
  stage: number
  channel: string
  state: number
  message?: string | null
  sendTime: number
}

interface BindStatus {
  email: string
  emailBound: boolean
  qbotAvailable: boolean
  qbotBound: boolean
  qbotWaiting: boolean
  groupName: string
  bindTime?: number | null
  code: string
  expireTime?: number | null
  remainSeconds: number
}

interface TodoForm {
  title: string
  description: string
  /** el-date-picker 的 value-format="x" 需要数字时间戳，传字符串会被当成日期文本解析 */
  eventTime: number
  /** 0 未完成 1 已完成；允许创建时就标记完成，用于补录已办事项 */
  finished: number
  notifyEmail: number
  notifyBot: number
}

const tabs = [
  {value: 'pending', label: '进行中'},
  {value: 'expired', label: '已过期'},
  {value: 'finished', label: '已完成'},
  {value: 'all', label: '全部'},
] as const

type FilterValue = typeof tabs[number]['value']

const todos = ref<Todo[]>([])
const counts = reactive({pending: 0, expired: 0, finished: 0, total: 0})
const filter = ref<FilterValue>('pending')
const loading = ref(true)
const now = ref(Date.now())

const emptyCopy: Record<FilterValue, [string, string]> = {
  pending: ['时间轴上还没有事', '新建一条待办，把时间点定下来。'],
  expired: ['没有错过的待办', '过了时间点仍未完成的会留在这里。'],
  finished: ['还没有完成的记录', '办完一项就勾掉，它会挪到这里。'],
  all: ['还没有待办', '新建一条待办，把时间点定下来。'],
}

const emptyTitle = computed(() => emptyCopy[filter.value][0])
const emptyHint = computed(() => emptyCopy[filter.value][1])

/* ---------------- 时间与文案 ---------------- */

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function fmtFull(ms?: number | null) {
  if (!ms) return '—'
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function dayText(ms: number) {
  const d = new Date(ms)
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function clockText(ms: number) {
  const d = new Date(ms)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 剩余时间的粗粒度文案，分钟级刷新足够 */
function spanText(ms: number) {
  const minutes = Math.max(0, Math.floor(ms / 60000))
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时 ${minutes % 60} 分`
  const days = Math.floor(hours / 24)
  return `${days} 天 ${hours % 24} 小时`
}

function remainText(todo: Todo) {
  if (todo.finished === 1) return '已完成'
  if (todo.expired === 1) {
    return `已过期 ${spanText(now.value - todo.eventTime)}`
  }
  return `还有 ${spanText(todo.eventTime - now.value)}`
}

function isSoon(todo: Todo) {
  return todo.finished !== 1 && todo.expired !== 1 && todo.eventTime - now.value <= 30 * 60 * 1000
}

function remainClass(todo: Todo) {
  if (todo.finished === 1) return ''
  if (todo.expired === 1) return 'is-over'
  return isSoon(todo) ? 'is-soon' : ''
}

function slotClass(todo: Todo) {
  return {
    'is-done': todo.finished === 1,
    'is-expired': todo.finished !== 1 && todo.expired === 1,
    'is-soon': isSoon(todo),
  }
}

function stageLabel(stage: number) {
  if (stage === 3) return '30 分钟前'
  if (stage === 2) return '2 小时前'
  return '24 小时前'
}

function channelLabel(channel: string) {
  return channel === 'qqbot' ? 'QQ 群' : '邮箱'
}

/* ---------------- 列表 ---------------- */

const visibleTodos = computed(() => todos.value)

const tabCount = (value: FilterValue) => {
  if (value === 'pending') return counts.pending
  if (value === 'expired') return counts.expired
  if (value === 'finished') return counts.finished
  return counts.total
}

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    const res: any = await service.get(`/api/todo/list?state=${filter.value}`)
    todos.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    if (!silent) toast(e?.msg || '加载待办失败')
  } finally {
    loading.value = false
  }
}

async function loadSummary() {
  try {
    const res: any = await service.get('/api/todo/summary')
    if (typeof res?.pending === 'number') {
      counts.pending = res.pending
      counts.expired = res.expired
      counts.finished = res.finished
      counts.total = res.total
    }
  } catch {
    // 统计失败不影响列表本身
  }
}

function changeFilter(value: FilterValue) {
  filter.value = value
  load()
}

/* ---------------- 绑定状态 ---------------- */

const bind = reactive<BindStatus>({
  email: '',
  emailBound: false,
  qbotAvailable: false,
  qbotBound: false,
  qbotWaiting: false,
  groupName: '',
  code: '',
  remainSeconds: 0,
})

const boundText = computed(() => bind.groupName
  ? `已绑定到「${bind.groupName}」`
  : '已绑定，提醒会发到指定群')

async function loadBind() {
  try {
    const res: any = await service.get('/api/todo/qqbot/status')
    if (!res || typeof res !== 'object') return
    bind.email = res.email || ''
    bind.emailBound = Boolean(res.emailBound)
    bind.qbotAvailable = Boolean(res.qbotAvailable)
    bind.qbotBound = Boolean(res.qbotBound)
    bind.qbotWaiting = Boolean(res.qbotWaiting)
    bind.groupName = res.groupName || ''
    bind.bindTime = res.bindTime
    bind.code = res.bindCode || ''
    bind.expireTime = res.expireTime
    bind.remainSeconds = Number(res.remainSeconds) || 0
  } catch {
    // 未登录或接口异常时保持默认未绑定状态
  }
}

const bindOpen = ref(false)
const bindCode = ref('')
const bindDeadline = ref(0)
const clockTick = ref(0)
let bindTimer: number | undefined
let pollTimer: number | undefined

const bindCountdown = computed(() => {
  // 显式依赖秒级心跳，让倒计时每秒重算
  void clockTick.value
  if (!bindCode.value) return '正在生成绑定码…'
  const remain = Math.max(0, Math.floor((bindDeadline.value - Date.now()) / 1000))
  if (remain <= 0) return '绑定码已过期，请重新生成'
  const m = Math.floor(remain / 60)
  const s = remain % 60
  return `剩余 ${m}:${pad(s)} · 过期后需重新生成`
})

async function openBind() {
  bindOpen.value = true
  // 已绑定时不自动出码：生成新码会覆盖旧绑定，必须由用户显式确认
  if (bind.qbotBound) return
  // 刷新页面后仍有一枚有效码在等待，直接续用，避免每次打开都覆盖
  if (bind.qbotWaiting && bind.code && bind.expireTime && bind.expireTime > Date.now()) {
    bindCode.value = bind.code
    bindDeadline.value = bind.expireTime
    startBindWatch()
    return
  }
  await renewCode()
}

/** 已绑定状态下换绑：先确认，再出码（旧绑定会立即失效） */
async function rebind() {
  try {
    await ElMessageBox.confirm('重新绑定会先解除当前群绑定，然后用新码绑定另一个群，确定继续吗？', '重新绑定', {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await renewCode()
}

async function renewCode() {
  try {
    const res: any = await service.post('/api/todo/qqbot/code')
    if (res?.code !== 200) {
      toast(res?.msg || '生成绑定码失败')
      return
    }
    bindCode.value = res.bindCode || ''
    bindDeadline.value = Number(res.expireTime) || 0
    // 后端生成新码时已清空旧绑定，本地同步为未绑定，避免轮询误判为已成功
    bind.qbotBound = false
    bind.groupName = ''
    startBindWatch()
  } catch (e: any) {
    toast(e?.msg || '生成绑定码失败')
  }
}

/** 码的有效期与绑定结果都靠轮询感知：群里发码是站外动作，没有回调可用 */
function startBindWatch() {
  stopBindWatch()
  bindTimer = window.setInterval(() => {
    clockTick.value += 1
    if (bindDeadline.value && bindDeadline.value <= Date.now()) {
      bindCode.value = ''
    }
  }, 1000)
  pollTimer = window.setInterval(async () => {
    if (!bindCode.value) return
    await loadBind()
    if (bind.qbotBound) {
      bindCode.value = ''
      stopBindWatch()
      toast('绑定成功', 'success')
      window.setTimeout(() => {
        bindOpen.value = false
      }, 900)
    }
  }, 2000)
}

function stopBindWatch() {
  if (bindTimer) {
    clearInterval(bindTimer)
    bindTimer = undefined
  }
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = undefined
  }
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(bindCode.value)
    toast('绑定码已复制', 'success')
  } catch {
    toast('复制失败，请手动记录这 6 位数字', 'warning')
  }
}

async function unbind() {
  try {
    await ElMessageBox.confirm('解除后，已勾选 QQ 群提醒的待办将无法送达，确定解除吗？', '解除绑定', {
      confirmButtonText: '解除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    const res: any = await service.delete('/api/todo/qqbot')
    if (res?.code === 200) {
      toast('已解除绑定', 'success')
      await loadBind()
    } else {
      toast(res?.msg || '解除失败')
    }
  } catch (e: any) {
    toast(e?.msg || '解除失败')
  }
}

/* ---------------- 新建 / 编辑 ---------------- */

const editorOpen = ref(false)
const editingId = ref<number | null>(null)
/** 编辑时的原事件时间：未改动时允许保留过去时间，便于只改状态或描述 */
const originalTime = ref<number | null>(null)
const saving = ref(false)

const form = reactive<TodoForm>(blankForm())

const formSummary = computed(() => {
  const at = form.eventTime ? fmtFull(form.eventTime) : '未选时间'
  return `${at} · 提醒 3 次`
})

function roundToFive(ms: number) {
  const step = 5 * 60 * 1000
  return Math.ceil(ms / step) * step
}

/** 默认放在 24 小时之后，正好对应第一次「24 小时前」提醒的边界 */
function defaultEventTime() {
  return roundToFive(Date.now() + 24 * 60 * 60 * 1000)
}

function blankForm(): TodoForm {
  return {
    title: '',
    description: '',
    eventTime: defaultEventTime(),
    finished: 0,
    notifyEmail: bind.emailBound ? 1 : 0,
    notifyBot: bind.emailBound ? 0 : (bind.qbotBound ? 1 : 0),
  }
}

function disabledDate(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

function openCreate() {
  Object.assign(form, blankForm())
  editingId.value = null
  originalTime.value = null
  editorOpen.value = true
}

function openEdit(todo: Todo) {
  Object.assign(form, {
    title: todo.title,
    description: todo.description || '',
    eventTime: todo.eventTime,
    finished: todo.finished === 1 ? 1 : 0,
    notifyEmail: todo.notifyEmail === 1 ? 1 : 0,
    notifyBot: todo.notifyBot === 1 ? 1 : 0,
  })
  editingId.value = todo.id
  originalTime.value = todo.eventTime
  editorOpen.value = true
}

function toggleWay(way: 'email' | 'bot') {
  if (way === 'email') {
    if (!bind.emailBound) {
      toast('请先在账号设置绑定邮箱', 'warning')
      return
    }
    form.notifyEmail = form.notifyEmail === 1 ? 0 : 1
  } else {
    if (!bind.qbotAvailable) {
      toast('系统未接入 QQ 机器人，暂时无法使用群提醒', 'warning')
      return
    }
    if (!bind.qbotBound) {
      toast('请先生成绑定码并在 QQ 群发送完成绑定', 'warning')
      return
    }
    form.notifyBot = form.notifyBot === 1 ? 0 : 1
  }
}

function validate(): string | null {
  if (!form.title.trim()) return '请填写事件名'
  const time = Number(form.eventTime)
  if (!time || Number.isNaN(time)) return '请选择事件时间点'
  // 未改时间时允许保留过去时间，只改状态或描述不必被迫改期
  if (time <= Date.now() && time !== originalTime.value) return '事件时间点需要晚于当前时间'
  return null
}

async function save() {
  const error = validate()
  if (error) {
    toast(error, 'warning')
    return
  }
  saving.value = true
  try {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      eventTime: Number(form.eventTime),
      finished: form.finished,
      notifyEmail: form.notifyEmail,
      notifyBot: form.notifyBot,
    }
    const res: any = editingId.value
      ? await service.put(`/api/todo/${editingId.value}`, payload)
      : await service.post('/api/todo', payload)
    if (res?.code === 200) {
      toast(res.msg || '已保存', 'success')
      editorOpen.value = false
      await Promise.all([load(true), loadSummary()])
    } else {
      toast(res?.msg || '保存失败')
    }
  } catch (e: any) {
    toast(e?.msg || '保存失败')
  } finally {
    saving.value = false
  }
}

/* ---------------- 完成 / 删除 ---------------- */

async function toggleFinished(todo: Todo) {
  const finished = todo.finished === 1 ? 0 : 1
  try {
    const res: any = await service.post(`/api/todo/${todo.id}/finished?finished=${finished}`)
    if (res?.code === 200) {
      toast(finished === 1 ? '已标记完成，后续提醒已停止' : '已恢复为未完成', 'success')
      await Promise.all([load(true), loadSummary()])
    } else {
      toast(res?.msg || '操作失败')
    }
  } catch (e: any) {
    toast(e?.msg || '操作失败')
  }
}

async function remove(todo: Todo) {
  try {
    await ElMessageBox.confirm(`删除「${todo.title}」后，相关提醒记录也会一并清除。`, '删除待办', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    const res: any = await service.delete(`/api/todo/${todo.id}`)
    if (res?.code === 200) {
      toast('已删除', 'success')
      await Promise.all([load(true), loadSummary()])
    } else {
      toast(res?.msg || '删除失败')
    }
  } catch (e: any) {
    toast(e?.msg || '删除失败')
  }
}

/* ---------------- 通知记录 ---------------- */

const logsOpen = ref(false)
const logTodo = ref<Todo | null>(null)
const logs = ref<NotifyLog[]>([])

async function openLogs(todo: Todo) {
  logTodo.value = todo
  logs.value = []
  logsOpen.value = true
  await refreshLogs()
}

async function refreshLogs() {
  if (!logTodo.value) return
  try {
    const res: any = await service.get(`/api/todo/${logTodo.value.id}/notify-logs`)
    logs.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    toast(e?.msg || '读取提醒记录失败')
  }
}

/* ---------------- 生命周期 ---------------- */

let clockTimer: number | undefined

/** 关闭弹窗即停止轮询，并刷新一次绑定状态，避免页面与后端短暂不一致 */
watch(bindOpen, (open) => {
  if (!open) {
    stopBindWatch()
    loadBind()
  }
})

onMounted(async () => {
  await loadBind()
  await Promise.all([load(), loadSummary()])
  clockTimer = window.setInterval(() => {
    now.value = Date.now()
  }, 30 * 1000)
})

onBeforeUnmount(() => {
  stopBindWatch()
  if (clockTimer) clearInterval(clockTimer)
})
</script>
