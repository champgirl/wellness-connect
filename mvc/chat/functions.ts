import {H3Event} from "h3";
import type {APIResponse, GPTChat} from "@/types";
import {addRequestToGlobalProcessingQueue} from "~/mvc/chat/helpers";
import {storeChat as storeChatQuery} from "~/mvc/chat/queries"
import * as fs from 'fs';
import path from 'path';

export async function completeGPT(event: H3Event) {
    const {messages} = await readBody(event)
    const instructionsLocation = path.join(process.cwd(), 'instructions.txt')
    const instructions = fs.readFileSync(instructionsLocation, 'utf8')

    const gptChat: GPTChat = {
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'system',
            content: instructions.trim()
        }]
    }

    gptChat.messages = gptChat.messages.concat(messages)

    addRequestToGlobalProcessingQueue(event, gptChat)
}

export async function storeChat(event: H3Event) {
    const {messages, studentId} = await readBody(event)

    if (!studentId) {
        event.node.res.statusCode = 401
        event.node.res.end("Unauthorized")
        return
    }

    if (!messages) {
        event.node.res.statusCode = 400
        event.node.res.end("Bad Request")
        return
    }

    const result = await storeChatQuery({
        studentId,
        chats: messages
    }).catch(e => e as Error)

    let response = {} as APIResponse
    if (result instanceof Error) {
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
}
