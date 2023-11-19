import {defineEventHandler, createRouter} from "h3";
import {register, login, requestReset, updatePassword, logout} from "~/mvc/auth/functions";

const router = createRouter()

router.post('/register', defineEventHandler(async event => {
    return register(event)
}))

router.post('/login', defineEventHandler(async event => {
    return login(event)
}))

router.post('/reset', defineEventHandler(async event => {
    return requestReset(event)
}))

router.post('/update', defineEventHandler(async event => {
    return updatePassword(event)
}))

router.get('/logout', defineEventHandler(async event => {
    return logout(event)
}))

export default useBase('/api/auth', router.handler)