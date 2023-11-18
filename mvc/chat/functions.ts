import {H3Event} from "h3";
import type {GPTChat} from "@/types";
import {addRequestToGlobalProcessingQueue} from "~/mvc/chat/helpers";
import type {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
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

    console.log(gptChat)

    addRequestToGlobalProcessingQueue(event, gptChat)
}