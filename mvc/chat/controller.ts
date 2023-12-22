import {createRouter, defineEventHandler} from "h3";
import {completeGPT, storeChat} from "~/mvc/chat/functions";
import {getUserByEmail, getUserFromToken} from "~/mvc/auth/queries";
import {type APIResponse, TokenType, userEnum, type UserState} from "~/types";
import {getChats, deleteUserChat, getStudentById, flagChat, getFlaggedChats, getChat} from "~/mvc/chat/queries";
import { mailFlaggedChat } from "../utils";

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


router.get('/flag', defineEventHandler(async event => {
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

    const student = await getStudentById(userState.id)
    if(!student){
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const flagged = await flagChat(student.id).catch(e => e as Error)
    if(flagged instanceof Error){
        event.node.res.statusCode = 500
        event.node.res.end(flagged.message)
        return
    }

    mailFlaggedChat(flagged.id, "http://localhost:3000", "/flagged")

    const response = {} as APIResponse
    response.statusCode = 200
    response.body = flagged

    return response
}))

router.get('/flagged', defineEventHandler(async event => {
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

    const user = await getUserByEmail(userState.email)
    if(!user || user.who !== userEnum.COUNSELOR){
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    const chats = await getFlaggedChats().catch(e => e as Error)
    if(chats instanceof Error){
        event.node.res.statusCode = 500
        event.node.res.end(chats.message)
        return
    }

    const response = {} as APIResponse
    response.statusCode = 200

    response.body = chats

    return response
}))

router.get('/get/:id', defineEventHandler(async event => {
    const id = event.context.params?.id

    if (!id) {
        event.node.res.statusCode = 400
        event.node.res.end("Bad Request")
        return
    }

    const chat = await getChat(+id).catch(e => e as Error)
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

export default useBase('/api/chat', router.handler)