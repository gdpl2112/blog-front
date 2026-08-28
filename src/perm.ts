import router from "@/router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie";
import {loadUser, service} from "@/axios";

const urls = ["/index.html",
    "/login", "/index", "/", "/apis",
    "/article", "/reg", "/room", "/tem",
    "/sponsors", "/ai"
    ,"/authc"
]

router.beforeEach(async (to, from, next) => {
    document.title = (to.meta.title as string) || "若生er,WebSite"
    const loggedIn = Cookie.get("token") || Cookie.get("authorization")
    const adminToken = sessionStorage.getItem("admin-token")?.trim()
    if (to.path === "/login" && loggedIn && await loadUser()) {
        return next({path: "/v0"})
    }
    if (to.meta.requiresAdmin) {
        if (!loggedIn && !adminToken) {
            toast("管理员登录后访问")
            return next({path: "/login"})
        }
        // ADMIN_TOKEN 是该接口支持的独立管理员凭证，权限由后端 /adm/ai 校验。
        if (!adminToken) {
            try {
                const roleResult = await service.get("/auth/role") as any
                const roles = Array.isArray(roleResult)
                    ? roleResult
                    : (Array.isArray(roleResult?.data) ? roleResult.data : [])
                if (!roles.includes("admin")) {
                    toast("仅管理员可访问", "warning")
                    return next({path: "/v0"})
                }
            } catch {
                toast("管理员权限校验失败", "warning")
                return next({path: "/v0"})
            }
        }
        if (!loggedIn && adminToken) {
            return next()
        }
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
