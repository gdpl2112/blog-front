import router from "@/router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie";
import {loadUser} from "@/axios";

const urls = ["/index.html",
    "/login", "/index", "/", "/apis",
    "/article", "/reg", "/room", "/tem",
    "/sponsors", "/ai"
    ,"/authc"
]

router.beforeEach(async (to, from, next) => {
    document.title = (to.meta.title as string) || "若生er,WebSite"
    const loggedIn = Cookie.get("token") || Cookie.get("authorization")
    if (to.path === "/login" && loggedIn && await loadUser()) {
        return next({path: "/v0"})
    }
    if (urls.includes(to.path.trim())) {
        next()
    } else {
        if (loggedIn) {
            next()
        } else {
            toast("登录后访问")
            return next({path: "/login"})
        }
    }
});
