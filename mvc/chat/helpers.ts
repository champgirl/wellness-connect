import { allowedChatInterval } from "~/types";
import type { GPTChat } from '~/types';
import { H3Event } from "h3";
import {GPTChatQueueItem} from "~/classes.server";

declare global {
    var gptChatQueue: GPTChatQueueItem[]
    var processingGPTChat: string;
}

async function ProcessQueue() {
    global.processingGPTChat = "processing"
    for await(const item of global.gptChatQueue){
        item.stream()
        global.gptChatQueue.shift()
        await new Promise(resolve => setTimeout(resolve, allowedChatInterval))
    }
    global.processingGPTChat = "not processing"
}

export async function addRequestToGlobalProcessingQueue(event: H3Event, gptChat: GPTChat) {
    if (!global.gptChatQueue) global.gptChatQueue = [] as GPTChatQueueItem[]
    if(!global.processingGPTChat) global.processingGPTChat = "not processing"

    global.gptChatQueue.push(new GPTChatQueueItem(event, gptChat))

    if (global.processingGPTChat === "not processing") ProcessQueue()
}