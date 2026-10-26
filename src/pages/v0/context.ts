import type {InjectionKey, Ref} from 'vue'

/**
 * 个人中心角色上下文。
 *
 * 由 v0.vue 统一请求 /auth/role 后注入，工作台与概览页直接取用，
 * 避免同一层级里重复请求同一份角色信息。
 */
export const CONSOLE_ROLES: InjectionKey<Ref<string[]>> = Symbol('console-roles')
