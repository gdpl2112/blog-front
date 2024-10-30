import service from "@/axios";

export function login(username: string, password: string) {
    return service.post("/ba/login", {
        username,
        password
    })
}