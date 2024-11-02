import router from "@/router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie";
import service from "@/axios";

const urls = ["/login", "/index", "/", "/apis", "/article", "/reg"]

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = "若生er,WebSite"
    }
    if (urls.includes(to.path.trim())) {
        next()
    } else {
        service.get("/user/login_state").then(res => {
            if (!res) {
                Cookie.remove("token")
            }
        }).catch(() => {

        })
        const token = Cookie.get("token")
        if (!token) {
            toast("登录后访问")
            return next({path: "/login"})
        } else {
            next()
        }
    }
});