import router from "@/router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie";
import service from "@/axios";

const urls = ["/index.html", "/login", "/index", "/", "/apis", "/article", "/reg", "/room", "/tem"]

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
                Cookie.remove("authorization")
            }
        }).catch(() => {

        })
        const token = Cookie.get("token")
        if (token) {
            next()
        } else {
            const auth = Cookie.get("authorization")
            if (auth) {
                next()
            } else {
                toast("登录后访问")
                return next({path: "/login"})
            }
        }
    }
});