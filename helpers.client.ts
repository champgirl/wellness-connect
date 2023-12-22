import { type UserState } from "~/types";

export function setAuthCookie(data: UserState) {
    const user = useCookie<UserState | null>('userState')
    user.value = data
    useUser().value = data
}

export function removeAuthCookie() {
    const user = useCookie<UserState | null>('userState')
    user.value = null
    useUser().value = null
}
export function getAuthCookie() {
    const user = useCookie<UserState | null>('userState')
    return user.value as UserState || null
}

export function userIsAuthenticated() {
    const user = getAuthCookie()
    console.log(user)
    console.log(useUser().value)
    if (!user && (!useUser().value?.token || useUser().value?.token === '')) return false
    return true
}

export async function userIsAdmin() {
    return await useFetch('/api/auth/isAdmin').then(res => res.data.value.body.isAdmin ?? false)
}