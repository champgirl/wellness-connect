import type {UserState} from "~/types";

export default defineNuxtPlugin(async () => {
    const cookie = useCookie<UserState | null | string>('userState')
    if(cookie.value === '') cookie.value = null

    const user = useUser()
    if (user.value) return

    if (!user.value) {
        // @ts-ignore
        user.value = useCookie<UserState>('userState')
    }
})