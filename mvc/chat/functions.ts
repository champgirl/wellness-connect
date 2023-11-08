import { H3Event } from "h3";
import type { GPTChat } from "@/types";
import { addRequestToGlobalProcessingQueue } from "~/mvc/chat/helpers";

export async function completeGPT(event: H3Event) {
    const gptChat: GPTChat = await readBody(event)
    addRequestToGlobalProcessingQueue(event, gptChat)
}