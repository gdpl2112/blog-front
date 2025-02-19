import axios from "axios";
import Cookie from "js-cookie";

const service = axios.create({
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
    return Promise.reject(err.response.data);
});

export default service;

export function getToken(): string {
    let token = Cookie.get("token");
    if (!token) {
        token = Cookie.get("authorization")
    }
    return token;
}