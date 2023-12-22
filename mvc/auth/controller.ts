import {defineEventHandler, createRouter} from "h3";
import {register, login, requestReset, updatePassword, logout} from "~/mvc/auth/functions";
import {getCounselorByEmail} from "~/mvc/auth/queries";

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

router.get('/isAdmin', defineEventHandler(async event => {
    const counselor = await getCounselorByEmail(JSON.parse(getCookie(event, 'userState') || '{}').email || '')
    if(!counselor) return {statusCode: 401, body: {isAdmin: false}}
    return {statusCode: 200, body: {isAdmin: true}}
}))

export default useBase('/api/auth', router.handler)