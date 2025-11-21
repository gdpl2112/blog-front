import router from "@/router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie";

const urls = ["/index.html",
    "/login", "/index", "/", "/apis",
    "/article", "/reg", "/room", "/tem",
    "/sponsors", "/ai"
    ,"/authc"
]

router.beforeEach((to, from, next) => {
    document.title = (to.meta.title as string) || "若生er,WebSite"
    if (urls.includes(to.path.trim())) {
        next()
    } else {
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