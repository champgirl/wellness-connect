import {createRouter, defineEventHandler} from "h3";
import {completeGPT, storeChat} from "~/mvc/chat/functions";
import {getUserFromToken} from "~/mvc/auth/queries";
import {type APIResponse, TokenType, userEnum, type UserState} from "~/types";
import {getChats, deleteUserChat} from "~/mvc/chat/queries";

const router = createRouter()

router.post('/gpt', defineEventHandler(event => {
    return completeGPT(event)
}))

router.post('/store', defineEventHandler(async event => {
    const cookie = getCookie(event, 'userState')

    if (!cookie) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const userState = JSON.parse(cookie) as UserState
    if (!userState) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const user = await getUserFromToken(userState.token, TokenType.BEARER, userEnum.STUDENT)
    if (!user) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    return storeChat(event)
}))

router.get("/get", defineEventHandler(async event => {
    const cookie = getCookie(event, 'userState')

    if (!cookie) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const userState = JSON.parse(cookie) as UserState
    if (!userState) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const chat = await getChats(userState.id).catch(e => e as Error)
    let response = {} as APIResponse
    if (chat instanceof Error) {
        response = {
            statusCode: 500,
            body: chat.message
        }

        return response
    }

    response = {
        statusCode: 200,
        body: chat
    }

    return response

}))

router.get('/clear', defineEventHandler(async (event) => {
    const cookie = getCookie(event, 'userState')

    if (!cookie) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const userState = JSON.parse(cookie) as UserState
    if (!userState) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    let response = {} as APIResponse
    const result = await deleteUserChat(userState.id).catch(err => err as Error)

    if(result instanceof Error){
        response = {
            statusCode: 500,
            body: result.message
        }
        return response
    }

    response = {
        statusCode: 200,
        body: result
    }

    return response
}))

export default useBase('/api/chat', router.handler)