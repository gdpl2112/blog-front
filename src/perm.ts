import router from "@/router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie";

const urls = ["/login", "/index", "/", "/api", "/notice"]

router.beforeEach((to, from, next) => {
    if (urls.includes(to.path.trim())) {
        next()
    } else {
        const token = Cookie.get("token")
        if (!token) {
            toast("登录后访问", "ERROR")
            return next({path: "/login"})
        } else {
            next()
        }
    }
    // next()
});