import {type UserState} from "~/types";

export function setAuthCookie(data: UserState){
    const user = useCookie<UserState | null>('userState')
    user.value = data
}

export function removeAuthCookie(){
    const user = useCookie<UserState | null>('userState')
    user.value = null
}