<style scoped>
/* =============================================
   定时任务：任务卡片 → 编辑器抽屉 → 执行日志
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

/* ---- 任务卡片 ---- */
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--gap-3);
}

.task-card {
  display: flex;
  flex-direction: column;
  padding: 14px 16px 11px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  background: var(--glass-thin);
  transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease),
    background var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.task-card:hover {
  transform: translateY(-2px);
  border-color: rgba(192, 57, 43, 0.26);
  background: var(--glass);
  box-shadow: 0 18px 36px -28px rgba(30, 38, 54, 0.55);
}

.task-card.is-off {
  opacity: 0.66;
}

.task-head {
  display: flex;
  align-items: center;
  gap: 9px;
}

.dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--seal);
  box-shadow: 0 0 0 3px var(--seal-wash);
}

.dot--off {
  background: var(--ink-3);
  box-shadow: none;
}

.dot--done {
  background: #2f7d5c;
  box-shadow: 0 0 0 3px rgba(47, 125, 92, 0.14);
}

.dot--running {
  animation: task-pulse 1.4s var(--ease) infinite;
}

@keyframes task-pulse {
  50% {
    box-shadow: 0 0 0 6px rgba(192, 57, 43, 0.12);
  }
}

.task-name {
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

.task-when {
  margin: 9px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  color: var(--ink-2);
}

.task-when i {
  margin-right: 5px;
  color: var(--ink-3);
}

.task-meta {
  display: grid;
  grid-template-columns: 1.35fr 1fr 0.7fr;
  gap: 8px;
  margin: 10px 0 0;
  padding-top: 9px;
  border-top: 1px solid var(--rule);
}

.task-meta dt {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--ink-3);
}

.task-meta dd {
  margin: 3px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-msg {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 9px 0 0;
  font-size: var(--text-xs);
  line-height: 1.65;
  color: var(--ink-3);
}

.task-foot {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  padding-top: 9px;
  border-top: 1px solid var(--rule);
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

.link--danger:hover {
  color: var(--color-danger);
}

.link:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spacer {
  flex: 1;
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

/* ---- 全屏编辑器 ---- */
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

.editor {
  display: grid;
  grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
  gap: var(--gap-6);
  height: 100%;
  min-height: 0;
}

.editor-side {
  display: flex;
  flex-direction: column;
  gap: var(--gap-5);
  min-height: 0;
  padding-right: var(--gap-5);
  border-right: 1px solid var(--rule);
  overflow-y: auto;
}

.editor-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
}

.main-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-3);
}

.main-head > label {
  font-size: var(--text-sm);
  letter-spacing: 0.03em;
  color: var(--ink);
}

.editor-main .code-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 220px;
}

.editor-main .code {
  flex: 1;
  min-height: 200px;
  max-height: none;
  resize: none;
}

/* ---- 表单 ---- */
.field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.field > label,
.field-head > label {
  font-size: var(--text-sm);
  letter-spacing: 0.03em;
  color: var(--ink);
}

.field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-3);
}

.field-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.seg {
  display: inline-flex;
  gap: 3px;
  width: fit-content;
  padding: 3px;
  border: 1px solid var(--glass-line-2);
  border-radius: 10px;
  background: var(--paper-2);
}

.seg button {
  padding: 6px 15px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  color: var(--ink-3);
  cursor: pointer;
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.seg button:hover {
  color: var(--ink);
}

.seg button.on {
  background: var(--ink);
  color: var(--on-ink);
}

.hint {
  margin: 0;
  font-size: var(--text-xs);
  line-height: 1.7;
  color: var(--ink-3);
}

.preview {
  margin: 0;
  padding: 7px 10px;
  border-left: 2px solid var(--seal);
  background: var(--seal-wash);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  line-height: 1.8;
  color: var(--ink-2);
}

.tilde {
  color: var(--ink-3);
}

.proxy-grid {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 8px;
}

.proxy-grid .wide {
  grid-column: span 2;
}

/* ---- 脚本编辑器 ---- */
.script-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeout {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
}

.code-wrap {
  overflow: hidden;
  border-radius: 12px;
  background: var(--block);
  box-shadow: inset 0 0 0 1px var(--block-rule);
}

.code {
  display: block;
  width: 100%;
  min-height: 250px;
  max-height: 420px;
  padding: 14px 16px;
  border: 0;
  outline: none;
  resize: vertical;
  background: transparent;
  color: var(--block-ink);
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.75;
  tab-size: 2;
}

.code::placeholder {
  color: var(--block-ink-2);
  opacity: 0.6;
}

.code-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 14px;
  border-top: 1px solid var(--block-rule);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: var(--block-ink-2);
}

.dry {
  margin-top: 2px;
}

.dry-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 6px;
}

.dry-out {
  max-height: 240px;
  margin: 0;
  padding: 12px 14px;
  overflow: auto;
  border-radius: 10px;
  background: var(--block);
  color: var(--block-ink);
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.api {
  border-top: 1px solid var(--rule);
  padding-top: 8px;
}

.api summary {
  font-size: var(--text-xs);
  color: var(--ink-3);
  cursor: pointer;
  list-style: none;
}

.api summary::-webkit-details-marker {
  display: none;
}

.api summary::before {
  content: '＋';
  margin-right: 6px;
  font-family: var(--font-mono);
}

.api[open] summary::before {
  content: '－';
}

.api-body {
  margin-top: 8px;
  font-size: var(--text-xs);
  line-height: 2;
  color: var(--ink-3);
}

.api-body code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--paper-2);
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 11px;
}

.dlg-foot {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ---- 全局脚本 ---- */
.lib-hint {
  margin-bottom: 12px;
  max-width: 70em;
}

.lib-code .code {
  min-height: 320px;
  max-height: 52vh;
  resize: vertical;
}

.lib-error {
  margin: 12px 0 0;
  padding: 8px 12px;
  border-left: 2px solid var(--color-danger);
  background: rgba(179, 38, 30, 0.07);
  font-size: var(--text-xs);
  line-height: 1.7;
  color: var(--color-danger);
}

/* ---- 日志 ---- */
.log-summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-3);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-2);
}

.log-summary .mono {
  font-size: var(--text-2xs);
  color: var(--ink-3);
}

.log-row {
  display: grid;
  grid-template-columns: 46px 1fr auto 42px 12px;
  align-items: center;
  gap: 10px;
  padding: 9px 2px;
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
}

.log-row:hover {
  background: var(--paper-2);
}

.log-state {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--color-danger);
}

.log-state.ok {
  color: #2f7d5c;
}

[data-theme='dark'] .log-state.ok {
  color: #6fc59c;
}

.log-time {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-2);
}

.log-cost,
.log-trigger {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
  white-space: nowrap;
}

.log-row i {
  font-size: 10px;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease);
}

.log-row.open i {
  transform: rotate(180deg);
}

.log-out {
  max-height: 320px;
  margin: 0 0 10px;
  padding: 12px 14px;
  overflow: auto;
  border-radius: 10px;
  background: var(--block);
  color: var(--block-ink);
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.log-more {
  width: 100%;
  margin-top: var(--gap-3);
}

@media (max-width: 980px) {
  .editor {
    grid-template-columns: 1fr;
    height: auto;
  }

  .editor-side {
    padding-right: 0;
    border-right: 0;
    overflow: visible;
  }

  .editor-main .code-wrap {
    min-height: 320px;
  }
}

@media (max-width: 640px) {
  .task-grid {
    grid-template-columns: 1fr;
  }

  .proxy-grid {
    grid-template-columns: 1fr 1fr;
  }

  .proxy-grid .wide {
    grid-column: span 2;
  }
}
</style>

<template>
  <div class="tool">
    <div class="tool-bar">
      <p class="tool-hint">
        按计划执行一段 JS：可选定点日期、每月某日或每日，时刻支持固定与区间随机；脚本内置网络请求工具，可按任务配置出站代理。每次执行都会留下日志。
      </p>
      <div class="tool-actions">
        <span class="tool-count">{{ tasks.length }} 个任务</span>
        <button class="btn btn--sm btn--ghost" type="button" @click="openLib">全局脚本</button>
        <button class="btn btn--sm btn--seal" type="button" @click="openCreate">新建任务</button>
      </div>
    </div>

    <div v-if="loading" class="empty-box">
      <strong>正在读取任务</strong>
      <span>稍候片刻。</span>
    </div>

    <div v-else-if="tasks.length === 0" class="empty-box">
      <strong>还没有定时任务</strong>
      <span>新建一个任务，选好时间，把要做的事写成脚本。</span>
    </div>

    <div v-else class="task-grid">
      <article v-for="task in tasks" :key="task.id" class="task-card" :class="{'is-off': task.state === 0}">
        <header class="task-head">
          <span class="dot" :class="dotClass(task)"></span>
          <h3 class="task-name" :title="task.name">{{ task.name }}</h3>
          <el-switch
            :model-value="task.state === 1"
            size="small"
            :disabled="task.state === 2 || task.running === 1"
            @change="(v: any) => toggleState(task, Boolean(v))"
          />
        </header>

        <p class="task-when">
          <i class="bi bi-clock"></i>{{ scheduleText(task) }}
          <span v-if="task.state === 2" class="chip" style="margin-left: 8px">已完成</span>
          <span v-else-if="task.running === 1" class="chip chip--seal" style="margin-left: 8px">执行中</span>
        </p>

        <dl class="task-meta">
          <div>
            <dt>下次</dt>
            <dd :title="fmtFull(task.nextRun)">{{ task.state === 1 ? fmtShort(task.nextRun) : '已停用' }}</dd>
          </div>
          <div>
            <dt>上次</dt>
            <dd :title="task.lastMsg || ''">{{ lastText(task) }}</dd>
          </div>
          <div>
            <dt>累计</dt>
            <dd>{{ task.runCount || 0 }} 次</dd>
          </div>
        </dl>

        <p v-if="task.lastMsg" class="task-msg">{{ task.lastMsg }}</p>

        <footer class="task-foot">
          <button class="link" type="button" :disabled="task.running === 1" @click="run(task)">立即执行</button>
          <button class="link" type="button" @click="openLogs(task)">日志</button>
          <button class="link" type="button" @click="openEdit(task)">编辑</button>
          <span class="spacer"></span>
          <button class="link link--danger" type="button" @click="remove(task)">删除</button>
        </footer>
      </article>
    </div>

    <!-- 编辑器：全屏弹窗，只有按钮能关闭 -->
    <el-dialog
      v-model="editorOpen"
      fullscreen
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="task-dialog"
    >
      <template #header>
        <div class="dlg-head">
          <h2 class="dlg-title">{{ editingId ? '编辑任务' : '新建任务' }}</h2>
          <span class="dlg-sub">{{ formSummary }}</span>
        </div>
      </template>

      <div class="editor">
        <aside class="editor-side">
          <section class="field">
            <label for="task-name">任务名称</label>
            <el-input id="task-name" v-model="form.name" maxlength="40" show-word-limit placeholder="例如：每日签到" />
          </section>

          <section class="field">
            <label>执行周期</label>
            <div class="seg">
              <button
                v-for="item in cycles"
                :key="item.value"
                type="button"
                :class="{on: form.cycleType === item.value}"
                @click="form.cycleType = item.value"
              >{{ item.label }}</button>
            </div>

            <div v-if="form.cycleType === 1" class="field-row">
              <el-date-picker
                v-model="form.runDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
                :disabled-date="disabledDate"
                style="width: 100%"
              />
            </div>
            <div v-else-if="form.cycleType === 2" class="field-row">
              <el-select v-model="form.dayOfMonth" placeholder="每月第几日" style="width: 130px">
                <el-option v-for="d in 31" :key="d" :label="`${d} 日`" :value="d" />
              </el-select>
              <span class="hint">没有这一天时取当月最后一天</span>
            </div>
          </section>

          <section class="field">
            <label>执行时刻</label>
            <div class="seg">
              <button type="button" :class="{on: form.timeMode === 1}" @click="form.timeMode = 1">固定时刻</button>
              <button type="button" :class="{on: form.timeMode === 2}" @click="form.timeMode = 2">区间随机</button>
            </div>
            <div class="field-row">
              <el-time-picker
                v-model="form.startTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="09:00"
                :clearable="false"
                style="width: 126px"
              />
              <template v-if="form.timeMode === 2">
                <span class="tilde">–</span>
                <el-time-picker
                  v-model="form.endTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="11:30"
                  :clearable="false"
                  style="width: 126px"
                />
              </template>
            </div>
            <p class="hint">
              {{ form.timeMode === 2
                ? '每次排期都会在区间内随机取一分钟，执行时间落库后固定不变。'
                : '按所选时刻准时执行。' }}
            </p>
            <p v-if="previewText" class="preview">未来三次：{{ previewText }}</p>
          </section>

          <section class="field">
            <div class="field-head">
              <label>网络请求代理</label>
              <el-switch v-model="proxyOn" size="small" />
            </div>
            <div v-if="proxyOn" class="proxy-grid">
              <el-select v-model="form.proxyType">
                <el-option label="HTTP" value="HTTP" />
                <el-option label="SOCKS" value="SOCKS" />
              </el-select>
              <el-input-number v-model="form.proxyPort" :min="1" :max="65535" :controls="false" placeholder="端口" />
              <el-input v-model="form.proxyHost" placeholder="代理地址，如 127.0.0.1" class="wide" />
              <el-input v-model="form.proxyUser" placeholder="代理账号（可选）" />
              <el-input v-model="form.proxyPwd" type="password" show-password placeholder="代理密码（可选）" />
            </div>
            <p class="hint">
              脚本内的 http 请求默认走此代理；单次请求可用 <code>{ proxy: false }</code> 直连，或传字符串临时改用其它代理。
            </p>
          </section>
        </aside>

        <section class="editor-main">
          <div class="main-head">
            <label>JS 脚本</label>
            <div class="script-tools">
              <button class="btn btn--sm btn--ghost" type="button" @click="applyTemplate">插入模板</button>
              <span class="timeout">
                超时
                <el-input-number v-model="form.timeoutSec" :min="5" :max="300" :controls="false" size="small" style="width: 58px" />
                秒
              </span>
            </div>
          </div>

          <div class="code-wrap">
            <textarea
              v-model="form.script"
              class="code"
              spellcheck="false"
              placeholder="// 在这里写 JS"
              @keydown.tab.prevent="insertTab"
            ></textarea>
            <div class="code-foot">
              <span>{{ scriptLines }} 行 · {{ form.script.length }} 字符</span>
              <span>NASHORN · ES5.1</span>
            </div>
          </div>

          <p class="hint">
            可直接调用「全局脚本」里定义的函数与变量；保存前会做语法检查与危险写法扫描。
          </p>

          <details class="api">
            <summary>脚本可用能力</summary>
            <div class="api-body">
              <div><code>http.get(url, headers?, {timeout, proxy})</code> · <code>http.post(url, body, headers?)</code> · <code>http.put</code> · <code>http.patch</code> · <code>http.del</code> · <code>http.request(cfg)</code></div>
              <div>响应：<code>status</code> <code>ok</code> <code>body</code> <code>headers</code> <code>json()</code> <code>text()</code> <code>error</code></div>
              <div><code>log.info / warn / error / debug</code> 写入执行日志；<code>console.log</code> 同义</div>
              <div>每次 <code>http</code> 请求会自动记一行「方法 · 地址 · 状态 · 耗时」，失败同样留痕。</div>
              <div><code>utils.md5 / sha1 / sha256 / hmacSha256 / base64Encode / base64Decode / urlEncode / now / formatDate / randomInt / randomString / uuid / sleep</code></div>
              <div><code>bot.ready</code> <code>bot.openid</code> · <code>bot.sendGroup(groupOpenid, text)</code> · <code>bot.sendGroupMarkdown(groupOpenid, text)</code> 通过系统接入的 QQ 机器人主动向指定群推送消息，未连接时返回 false。</div>
              <div><code>task.id</code> <code>task.name</code> <code>task.runAt</code> <code>proxy.host</code> <code>proxy.port</code></div>
              <div>定义 <code>function main()</code> 时以其返回值为执行结果；顶层代码每次执行都会重跑。</div>
            </div>
          </details>

          <div v-if="dry" class="dry">
            <div class="dry-head">
              <span class="chip" :class="dry.state === 1 ? 'chip--ok' : ''">{{ dry.state === 1 ? '试运行成功' : '试运行失败' }}</span>
              <span class="hint mono">{{ dry.costMs }} ms</span>
              <span class="spacer"></span>
              <button class="link" type="button" @click="dry = null">清除</button>
            </div>
            <pre class="dry-out">{{ dryText }}</pre>
          </div>
        </section>
      </div>

      <template #footer>
        <div class="dlg-foot">
          <button class="btn btn--sm" type="button" :disabled="dryRunning" @click="dryRun">
            {{ dryRunning ? '执行中…' : '试运行' }}
          </button>
          <span class="spacer"></span>
          <button class="btn btn--sm" type="button" @click="editorOpen = false">取消</button>
          <button class="btn btn--sm btn--seal" type="button" :disabled="saving" @click="save">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户级公共脚本：所有任务共用 -->
    <el-dialog
      v-model="libOpen"
      width="min(960px, 94vw)"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="lib-dialog"
    >
      <template #header>
        <div class="dlg-head">
          <h2 class="dlg-title">全局脚本</h2>
          <span class="dlg-sub">该用户所有任务共用 · {{ libUpdatedText }}</span>
        </div>
      </template>

      <p class="hint lib-hint">
        这里的变量与函数会在每个任务脚本之前执行，任务脚本可直接调用。只放定义，不要放有副作用的一次性逻辑。
        禁止 Java 互操作、进程退出、反射、文件与原生网络、动态代码执行。
      </p>

      <div class="code-wrap lib-code">
        <textarea v-model="libCode" class="code" spellcheck="false" placeholder="// 用户级公共脚本"></textarea>
        <div class="code-foot">
          <span>{{ libLines }} 行 · {{ libCode.length }} 字符</span>
          <span>USER LIB</span>
        </div>
      </div>

      <p v-if="libError" class="lib-error">{{ libError }}</p>

      <template #footer>
        <div class="dlg-foot">
          <button class="btn btn--sm" type="button" :disabled="libChecking" @click="checkLib">
            {{ libChecking ? '检查中…' : '语法检查' }}
          </button>
          <span class="spacer"></span>
          <button class="btn btn--sm" type="button" @click="libOpen = false">取消</button>
          <button class="btn btn--sm btn--seal" type="button" :disabled="libSaving" @click="saveLib">
            {{ libSaving ? '保存中…' : '保存' }}
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- 执行日志 -->
    <el-drawer v-model="logsOpen" :title="`${logTask?.name || ''} · 执行日志`" size="min(620px, 96vw)" append-to-body>
      <div class="log-summary">
        <span class="mono">共 {{ logTotal }} 条 · 保留最近 100 条</span>
        <button class="link" type="button" @click="refreshLogs">刷新</button>
      </div>

      <div v-if="logs.length === 0" class="empty-box">
        <strong>还没有执行记录</strong>
        <span>任务执行一次后，这里会出现输出与耗时。</span>
      </div>

      <template v-else>
        <div v-for="item in logs" :key="item.id">
          <div class="log-row" :class="{open: expanded === item.id}" @click="toggleLog(item.id)">
            <span class="log-state" :class="{'ok': item.state === 1}">{{ item.state === 1 ? '成功' : '失败' }}</span>
            <span class="log-time">{{ fmtFull(item.startTime) }}</span>
            <span class="log-cost">{{ item.costMs }} ms</span>
            <span class="log-trigger">{{ triggerText(item.triggerType) }}</span>
            <i class="bi bi-chevron-down"></i>
          </div>
          <pre v-if="expanded === item.id" class="log-out">{{ logText(item) }}</pre>
        </div>

        <button v-if="logs.length < logTotal" class="btn btn--sm log-more" type="button" @click="loadMoreLogs">
          加载更多
        </button>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import {ElMessageBox} from 'element-plus'
import service from '@/axios'
import {toast} from '@/utils/utils'

interface Task {
  id: number
  name: string
  cycleType: number
  runDate?: string | null
  dayOfMonth?: number | null
  timeMode: number
  startTime: string
  endTime?: string | null
  proxyEnabled: number
  proxyType?: string
  proxyHost?: string | null
  proxyPort?: number | null
  proxyUser?: string | null
  proxyPwd?: string | null
  script?: string | null
  state: number
  timeoutSec: number
  nextRun?: number | null
  lastRun?: number | null
  lastStatus?: number | null
  lastMsg?: string | null
  runCount: number
  running: number
}

interface LogItem {
  id: number
  state: number
  startTime: number
  costMs: number
  triggerType: number
  error?: string | null
  output?: string | null
}

interface TaskForm {
  name: string
  cycleType: number
  runDate: string
  dayOfMonth: number
  timeMode: number
  startTime: string
  endTime: string
  proxyEnabled: number
  proxyType: string
  proxyHost: string
  proxyPort?: number
  proxyUser: string
  proxyPwd: string
  script: string
  timeoutSec?: number
}

const cycles = [
  {value: 1, label: '定点日期'},
  {value: 2, label: '每月'},
  {value: 3, label: '每日'},
]

const TEMPLATE_GET = `// 发起一次 GET，并把结果写进执行日志
var res = http.get('https://httpbin.org/get', { 'Accept': 'application/json' });
log.info('status', res.status);
if (res.ok) {
  var data = res.json();
  log.info('origin', data && data.origin);
} else {
  log.error('请求失败', res.error);
}
`

const TEMPLATE_POST = `// POST JSON：默认代理取自任务配置
var res = http.post('https://httpbin.org/post', {
  hello: 'world',
  at: utils.formatDate(utils.now(), 'yyyy-MM-dd HH:mm:ss')
}, { 'X-Token': 'demo' });

log.info('status', res.status, '耗时', res.costMs + 'ms');
return res.json();
`

const tasks = ref<Task[]>([])
const loading = ref(true)

/* ---------------- 时间格式 ---------------- */

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function fmtFull(ms?: number | null) {
  if (!ms) return '—'
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fmtShort(ms?: number | null) {
  if (!ms) return '—'
  const d = new Date(ms)
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function scheduleText(task: Task) {
  const time = task.timeMode === 2
    ? `${task.startTime}–${task.endTime} 随机`
    : task.startTime
  if (task.cycleType === 1) return `${task.runDate} ${time}`
  if (task.cycleType === 2) return `每月 ${task.dayOfMonth} 日 ${time}`
  return `每日 ${time}`
}

function lastText(task: Task) {
  if (!task.lastRun) return '未执行'
  const prefix = task.lastStatus === 1 ? '成功' : task.lastStatus === 0 ? '失败' : '—'
  return `${prefix} ${fmtShort(task.lastRun)}`
}

function dotClass(task: Task) {
  if (task.running === 1) return 'dot--running'
  if (task.state === 0) return 'dot--off'
  if (task.state === 2) return 'dot--done'
  return ''
}

function triggerText(type: number) {
  if (type === 2) return '手动'
  if (type === 3) return '试运行'
  return '定时'
}

/* ---------------- 列表 ---------------- */

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    const res: any = await service.get('/api/task/list')
    tasks.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    if (!silent) toast(e?.msg || '加载任务失败')
  } finally {
    loading.value = false
  }
}

/* ---------------- 表单 ---------------- */

const editorOpen = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const dryRunning = ref(false)
const dry = ref<{state: number; output?: string; error?: string; costMs: number} | null>(null)
const previewText = ref('')

const form = reactive<TaskForm>(blankForm())

const proxyOn = computed({
  get: () => form.proxyEnabled === 1,
  set: (v: boolean) => { form.proxyEnabled = v ? 1 : 0 },
})

const scriptLines = computed(() => form.script.split('\n').length)

/** 弹窗标题旁的一句话排期，随表单实时变化 */
const formSummary = computed(() => {
  const time = form.timeMode === 2
    ? `${form.startTime}–${form.endTime} 随机`
    : form.startTime
  if (form.cycleType === 1) return `${form.runDate || '未选日期'} ${time}`
  if (form.cycleType === 2) return `每月 ${form.dayOfMonth || '—'} 日 ${time}`
  return `每日 ${time}`
})

const dryText = computed(() => {
  if (!dry.value) return ''
  const body = dry.value.output || ''
  const error = dry.value.error ? `\n${dry.value.error}` : ''
  return (body || '（脚本没有输出）') + error
})

function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function blankForm(): TaskForm {
  return {
    name: '',
    cycleType: 3,
    runDate: todayString(),
    dayOfMonth: new Date().getDate(),
    timeMode: 1,
    startTime: '09:00',
    endTime: '11:00',
    proxyEnabled: 0,
    proxyType: 'HTTP',
    proxyHost: '',
    proxyPort: 7890,
    proxyUser: '',
    proxyPwd: '',
    script: TEMPLATE_GET,
    timeoutSec: 60,
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
  dry.value = null
  previewText.value = ''
  editorOpen.value = true
  schedulePreview()
}

async function openEdit(task: Task) {
  try {
    const detail: any = await service.get(`/api/task/${task.id}`)
    if (!detail || !detail.id) {
      toast(detail?.msg || '任务不存在')
      return
    }
    Object.assign(form, {
      name: detail.name,
      cycleType: detail.cycleType,
      runDate: detail.runDate || todayString(),
      dayOfMonth: detail.dayOfMonth || new Date().getDate(),
      timeMode: detail.timeMode,
      startTime: detail.startTime,
      endTime: detail.endTime || '11:00',
      proxyEnabled: detail.proxyEnabled ? 1 : 0,
      proxyType: detail.proxyType || 'HTTP',
      proxyHost: detail.proxyHost || '',
      proxyPort: detail.proxyPort || 7890,
      proxyUser: detail.proxyUser || '',
      proxyPwd: detail.proxyPwd || '',
      script: detail.script || TEMPLATE_GET,
      timeoutSec: detail.timeoutSec || 60,
    })
    editingId.value = detail.id
    dry.value = null
    editorOpen.value = true
    schedulePreview()
  } catch (e: any) {
    toast(e?.msg || '读取任务失败')
  }
}

function validate(): string | null {
  if (!form.name.trim()) return '请填写任务名称'
  if (!form.script.trim()) return '请填写脚本'
  if (form.cycleType === 1 && !form.runDate) return '请选择定点日期'
  if (form.cycleType === 2 && !form.dayOfMonth) return '请选择每月执行日'
  if (!form.startTime) return '请选择开始时刻'
  if (form.timeMode === 2) {
    if (!form.endTime) return '请选择结束时刻'
    if (form.endTime <= form.startTime) return '结束时刻需晚于开始时刻'
  }
  if (form.proxyEnabled === 1) {
    if (!form.proxyHost.trim()) return '请填写代理地址'
    if (!form.proxyPort) return '请填写代理端口'
  }
  return null
}

function payload() {
  return {
    ...form,
    name: form.name.trim(),
    proxyHost: form.proxyHost.trim(),
    proxyUser: form.proxyUser.trim(),
    endTime: form.timeMode === 2 ? form.endTime : null,
    runDate: form.cycleType === 1 ? form.runDate : null,
    dayOfMonth: form.cycleType === 2 ? form.dayOfMonth : null,
  }
}

async function save() {
  const error = validate()
  if (error) {
    toast(error, 'warning')
    return
  }
  saving.value = true
  try {
    const res: any = editingId.value
      ? await service.put(`/api/task/${editingId.value}`, payload())
      : await service.post('/api/task', payload())
    if (res.code === 200) {
      toast(res.msg || '已保存', 'success')
      editorOpen.value = false
      await load(true)
    } else {
      toast(res.msg || '保存失败')
    }
  } catch (e: any) {
    toast(e?.msg || '保存失败')
  } finally {
    saving.value = false
  }
}

async function dryRun() {
  if (!form.script.trim()) {
    toast('请先填写脚本', 'warning')
    return
  }
  dryRunning.value = true
  dry.value = null
  try {
    const res: any = await service.post('/api/task/dry-run', {
      script: form.script,
      timeoutSec: form.timeoutSec,
      proxyEnabled: form.proxyEnabled,
      proxyType: form.proxyType,
      proxyHost: form.proxyHost.trim(),
      proxyPort: form.proxyPort,
      proxyUser: form.proxyUser.trim(),
      proxyPwd: form.proxyPwd,
    }, {timeout: 320000})
    if (res.code === 200) {
      dry.value = {state: res.state, output: res.output, error: res.error, costMs: res.costMs}
      toast(res.msg || '执行完成', res.state === 1 ? 'success' : 'warning')
    } else {
      toast(res.msg || '试运行失败')
    }
  } catch (e: any) {
    toast(e?.msg || '试运行失败')
  } finally {
    dryRunning.value = false
  }
}

function insertTab(event: Event) {
  const el = event.target as HTMLTextAreaElement
  const start = el.selectionStart
  const end = el.selectionEnd
  form.script = `${form.script.slice(0, start)}  ${form.script.slice(end)}`
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + 2
  })
}

async function applyTemplate() {
  const next = form.script.includes('http.post') ? TEMPLATE_GET : TEMPLATE_POST
  if (form.script.trim() && form.script !== TEMPLATE_GET && form.script !== TEMPLATE_POST) {
    try {
      await ElMessageBox.confirm('插入模板会替换当前脚本，继续？', '替换脚本', {
        confirmButtonText: '替换',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return
    }
  }
  form.script = next
}

/* ---------------- 执行时间预览 ---------------- */

let previewTimer: number | undefined

function schedulePreview() {
  previewText.value = ''
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = window.setTimeout(async () => {
    try {
      const res: any = await service.post('/api/task/preview', {
        cycleType: form.cycleType,
        runDate: form.runDate,
        dayOfMonth: form.dayOfMonth,
        timeMode: form.timeMode,
        startTime: form.startTime,
        endTime: form.endTime,
      })
      if (res.code === 200 && Array.isArray(res.times)) {
        previewText.value = res.times.map((t: number) => fmtShort(t)).join(' · ')
      } else {
        previewText.value = res.msg || ''
      }
    } catch {
      previewText.value = ''
    }
  }, 400)
}

watch(
  () => [form.cycleType, form.runDate, form.dayOfMonth, form.timeMode, form.startTime, form.endTime],
  () => {
    if (editorOpen.value) schedulePreview()
  },
)

/* ---------------- 全局脚本 ---------------- */

const libOpen = ref(false)
const libCode = ref('')
const libUpdated = ref(0)
const libSaving = ref(false)
const libChecking = ref(false)
const libError = ref('')

const libLines = computed(() => libCode.value.split('\n').length)
const libUpdatedText = computed(() => (libUpdated.value ? `最近保存 ${fmtFull(libUpdated.value)}` : '尚未保存'))

async function openLib() {
  libError.value = ''
  try {
    const res: any = await service.get('/api/task/lib')
    if (res && res.uid) {
      libCode.value = res.code || ''
      libUpdated.value = res.updateTime || 0
      libOpen.value = true
    } else {
      toast(res?.msg || '读取全局脚本失败')
    }
  } catch (e: any) {
    toast(e?.msg || '读取全局脚本失败')
  }
}

async function checkLib() {
  libChecking.value = true
  libError.value = ''
  try {
    const res: any = await service.post('/api/task/lib/validate', {code: libCode.value})
    if (res.code === 200) {
      toast(res.msg || '检查通过', 'success')
    } else {
      libError.value = res.msg || '检查失败'
      toast(libError.value)
    }
  } catch (e: any) {
    libError.value = e?.msg || '检查失败'
    toast(libError.value)
  } finally {
    libChecking.value = false
  }
}

async function saveLib() {
  libSaving.value = true
  libError.value = ''
  try {
    const res: any = await service.put('/api/task/lib', {code: libCode.value})
    if (res.code === 200) {
      toast(res.msg || '已保存', 'success')
      libOpen.value = false
    } else {
      libError.value = res.msg || '保存失败'
      toast(libError.value)
    }
  } catch (e: any) {
    libError.value = e?.msg || '保存失败'
    toast(libError.value)
  } finally {
    libSaving.value = false
  }
}

/* ---------------- 任务操作 ---------------- */

async function toggleState(task: Task, enable: boolean) {
  try {
    const res: any = await service.post(`/api/task/${task.id}/state?state=${enable ? 1 : 0}`)
    if (res.code === 200) {
      toast(res.msg, 'success')
      await load(true)
    } else {
      toast(res.msg || '操作失败')
    }
  } catch (e: any) {
    toast(e?.msg || '操作失败')
  }
}

async function run(task: Task) {
  try {
    const res: any = await service.post(`/api/task/${task.id}/run`)
    if (res.code === 200) {
      toast('已提交执行', 'success')
      await load(true)
      window.setTimeout(() => {
        openLogs(task)
      }, 900)
    } else {
      toast(res.msg || '提交失败')
    }
  } catch (e: any) {
    toast(e?.msg || '提交失败')
  }
}

async function remove(task: Task) {
  try {
    await ElMessageBox.confirm(`删除「${task.name}」及其全部执行日志？`, '删除任务', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    const res: any = await service.delete(`/api/task/${task.id}`)
    if (res.code === 200) {
      toast(res.msg, 'success')
      await load(true)
    } else {
      toast(res.msg || '删除失败')
    }
  } catch (e: any) {
    toast(e?.msg || '删除失败')
  }
}

/* ---------------- 日志 ---------------- */

const logsOpen = ref(false)
const logTask = ref<Task | null>(null)
const logs = ref<LogItem[]>([])
const logTotal = ref(0)
const expanded = ref<number | null>(null)
const details = reactive<Record<number, LogItem>>({})

let logPage = 1
let logTimer: number | undefined

function openLogs(task: Task) {
  logTask.value = task
  logs.value = []
  logTotal.value = 0
  logPage = 1
  expanded.value = null
  logsOpen.value = true
  refreshLogs()
}

async function fetchLogs(page: number) {
  if (!logTask.value) return
  try {
    const res: any = await service.get(`/api/task/${logTask.value.id}/logs?page=${page}&size=10`)
    if (!res || !Array.isArray(res.records)) return
    logTotal.value = res.total || 0
    if (page === 1) {
      const known = new Set(logs.value.map(item => item.id))
      const fresh = res.records.filter((item: LogItem) => !known.has(item.id))
      logs.value = [...fresh, ...logs.value]
      if (expanded.value === null && logs.value.length > 0) {
        expanded.value = logs.value[0].id
        loadDetail(logs.value[0].id)
      }
    } else {
      const known = new Set(logs.value.map(item => item.id))
      const fresh = res.records.filter((item: LogItem) => !known.has(item.id))
      logs.value = [...logs.value, ...fresh]
    }
  } catch {
    /* 轮询失败保持静默，下一次重试 */
  }
}

async function refreshLogs() {
  logPage = 1
  await fetchLogs(1)
}

async function loadMoreLogs() {
  logPage += 1
  await fetchLogs(logPage)
}

async function loadDetail(id: number) {
  if (details[id]) return
  try {
    const res: any = await service.get(`/api/task/log/${id}`)
    if (res && res.id) details[id] = res
  } catch {
    /* 详情加载失败时保持列表态 */
  }
}

function toggleLog(id: number) {
  if (expanded.value === id) {
    expanded.value = null
    return
  }
  expanded.value = id
  loadDetail(id)
}

function logText(item: LogItem) {
  const detail = details[item.id]
  if (!detail) return '读取中…'
  const body = detail.output || ''
  const error = detail.error ? `\n${detail.error}` : ''
  return (body || '（脚本没有输出）') + error
}

function stopLogPolling() {
  if (logTimer) {
    clearInterval(logTimer)
    logTimer = undefined
  }
}

watch(logsOpen, open => {
  stopLogPolling()
  if (open) logTimer = window.setInterval(refreshLogs, 4000)
})

/* ---------------- 生命周期 ---------------- */

let listTimer: number | undefined

onMounted(() => {
  load()
  listTimer = window.setInterval(() => {
    if (!document.hidden && !editorOpen.value) load(true)
  }, 20000)
})

onBeforeUnmount(() => {
  if (listTimer) clearInterval(listTimer)
  if (previewTimer) clearTimeout(previewTimer)
  stopLogPolling()
})
</script>
