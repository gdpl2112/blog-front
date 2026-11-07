/**
 * 通过 index.html 内 <script> 标签以 UMD 形式加载的第三方 SDK 没有 npm 类型声明，
 * 这里统一补充 window 上的最小可用契约，避免业务代码里散落 any / @ts-ignore。
 */
export {}

/** QQ 互联 JS SDK（qc_jssdk.js）的登录能力。 */
export interface QcLogin {
    /** 打开 QQ 授权登录弹窗 */
    showPopup(options: { appId: string; redirectURI: string }): void
}

export interface QcSdk {
    Login: QcLogin

    [key: string]: any
}

declare global {
    interface Window {
        /** APlayer 播放器实例，由 App.vue 初始化后挂载，供其他页面复用同一个播放器。 */
        ap?: any
        /** QQ 互联 SDK；脚本被拦截或网络异常时可能未注入。 */
        qc?: QcSdk
    }
}
