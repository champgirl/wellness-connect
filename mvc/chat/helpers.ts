import { allowedChatInterval } from "~/types";
import type { GPTChat } from '~/types';
import { H3Event } from "h3";
import {GPTChatQueueItem} from "~/classes.server";

declare global {
    var gptChatQueue: GPTChatQueueItem[]
    var processingGPTChat: boolean;
}

async function ProcessQueue() {
    for await(const item of global.gptChatQueue){
        item.stream()
        await new Promise(resolve => setTimeout(resolve, allowedChatInterval))
    }
}

export async function addRequestToGlobalProcessingQueue(event: H3Event, gptChat: GPTChat) {
    if (!global.gptChatQueue) global.gptChatQueue = [] as GPTChatQueueItem[]

    global.gptChatQueue.push(new GPTChatQueueItem(event, gptChat))

    if (!global.processingGPTChat) ProcessQueue()
}