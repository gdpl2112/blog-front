import axios from "axios";
import Cookie from "js-cookie";
import router from "@/router";
import {toast} from "@/utils/utils";
import {ref} from "vue";

export const service = axios.create({
    baseURL: '/',
    timeout: 30000,
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers['Token'] = Cookie.get("token")
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
}, function (err) {
    console.log(err.response)
    if (err.response.status === 403) {
        Cookie.remove("token")
        Cookie.remove("authorization")
        toast("登录过期! 请尝试重新登录.", "warning")
        userInfo.value = {}
        login_state.value = false;
        router.push("/login")
    }
    return Promise.reject(err.response.data);
});

type StateInfo = {
    code: number,
    msg: string,
    data: any
}

export const userInfo = ref({})

//登录状态
export const login_state = ref(false)

export async function loadUser() {
    try {
        const res = await service.get("/auth/state_info");
        let data = res as unknown as StateInfo;
        if (data.code == 204) {
            login_state.value = false;
            Cookie.remove("token");
            Cookie.remove("authorization");
            userInfo.value = {};
        } else {
            login_state.value = true;
            userInfo.value = data.data;
        }
    } catch (err) {
        toast("获取登录信息失败,请尝试重新登录");
    }
}

export function userLogout() {
    service.post("/auth/logout").then(r => {
        if (r.code == 200) {
            toast("退出登录成功", "success")
            Cookie.remove("token")
            Cookie.remove("authorization")
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