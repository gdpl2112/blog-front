import axios from "axios";
import Cookie from "js-cookie";
import router from "@/router";
import {toast} from "@/utils/utils";
import {ref} from "vue";

export const service = axios.create({
    baseURL: '/',
    timeout: 30000,
    // 当前 API 与前端共用 kloping.top；显式携带 Cookie 也兼容后续跨域部署。
    withCredentials: true,
});

// 后端令牌默认 7 天有效，并会在请求时滑动续期。此前未传 expires，
// js-cookie 会创建会话 Cookie，浏览器关闭或恢复会话时可能导致登录态丢失。
const AUTH_COOKIE_DAYS = 7;

function authCookieOptions() {
    return {
        expires: AUTH_COOKIE_DAYS,
        path: '/',
        sameSite: 'lax' as const,
        secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    };
}

/** 持久化登录令牌，并兼容已有的 authorization Cookie。 */
export function setAuthToken(token: unknown) {
    if (typeof token !== 'string') return;
    const value = token.trim();
    if (!value) return;
    Cookie.set('token', value, authCookieOptions());
}

export function clearAuthCookies() {
    // remove 必须使用与 set 相同的 path，否则旧 Cookie 可能继续存在。
    Cookie.remove('token', {path: '/'});
    Cookie.remove('authorization', {path: '/'});
}

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 保留调用方显式传入的管理端凭证（例如 /adm/ai 使用的 Bearer token）。
    // 普通请求仍沿用登录态 Cookie。
    const headers = config.headers || {}
    const hasHeader = (name: string) => Boolean(headers[name] || headers[name.toLowerCase()])
    const token = Cookie.get("token")
    const authorization = Cookie.get("authorization")
    // 续期前端 Cookie，并将后端下发的 authorization Cookie 迁移为 token Cookie。
    setAuthToken(token || authorization)
    if (!hasHeader('Token') && !hasHeader('token') && token) headers['Token'] = token
    if (!hasHeader('Authorization') && !hasHeader('authorization') && authorization) headers['Authorization'] = authorization
    config.headers = headers
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return (response.data as any);
}, function (err) {
    console.log(err.response)
    const requestUrl = String(err.config?.url || '')
    const manualAdminToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin-token') : ''
    const isManualAdminRequest = requestUrl.startsWith('/adm/ai') && Boolean(manualAdminToken)
    if (err.response?.status === 403 && !isManualAdminRequest) {
        clearAuthCookies()
        toast("登录过期! 请尝试重新登录.", "warning")
        userInfo.value = {}
        login_state.value = false;
        router.push("/login")
    }
    return Promise.reject((err.response?.data ?? err) as any);
});

type StateInfo = {
    code: number,
    msg: string,
    data: any
}

export const userInfo = ref({} as any)

//登录状态
export const login_state = ref(false)

export async function loadUser() {
    try {
        const res = await service.get("/auth/state_info");
        let data = res as unknown as StateInfo;
        if (data.code !== 200) {
            login_state.value = false;
            clearAuthCookies();
            userInfo.value = {};
            return false;
        } else {
            login_state.value = true;
            userInfo.value = data.data;
            return true;
        }
    } catch (err) {
        toast("获取登录信息失败,请尝试重新登录");
        return false;
    }
}

export function userLogout() {
    service.post("/auth/logout").then(r0 => {
        let r = r0 as unknown as StateInfo;
        if (r.code == 200) {
            toast("退出登录成功", "success")
            clearAuthCookies()
            userInfo.value = {}
            login_state.value = false
        }
    })
}

export function userLogin(username: string, password: string) {
    return service.post("/auth/login", {
        username,
        password
    })
}

export default service
