import {H3Event} from "h3";
import {openai} from "~/mvc/external/OpenAi";
import type {GPTChat, HttpResponse} from "~/types";
import fs from "fs";

class Stream {
    private headersSent: boolean;
    private _event: H3Event;

    constructor(event: H3Event) {
        this.headersSent = false;
        this._event = event;
        this.flushHeaders()
    }

    flushHeaders() {
        if (!this.headersSent) {
            this._event.node.res.setHeader('Content-Type', 'text/event-stream');
            this._event.node.res.setHeader('Cache-Control', 'no-cache');
            this._event.node.res.setHeader('Connection', 'keep-alive');
            this.headersSent = true;
        } else {
            console.warn("Headers already sent")
        }

        this._event.node.res.flushHeaders();

        const response = {} as HttpResponse
        response.statusCode = 204
        response.body = "Processing"

        this._event.node.res.write(JSON.stringify(response))
    }

    write(chunk: any) {
        this._event.node.res.write(chunk);
    }

    end() {
        this._event.node.res.end();
    }
}

export class GPTChatQueueItem {
    private readonly _gptChat: GPTChat;
    private readonly _stream: Stream;

    constructor(event: H3Event, gptChat: GPTChat) {
        this._stream = new Stream(event)
        this._gptChat = gptChat;
    }

    async stream() {
        console.log(this._gptChat)
        try {
            const completion = await openai.chat.completions.create({
                ...this._gptChat,
                stream: true
            }).catch(err => {
                console.error(err)
                this._stream.write(JSON.stringify({
                    statusCode: 500,
                    body: err
                }))

                return []
            })

            for await (const chunk of completion) {
                // console.log(chunk)
                this._stream.write(JSON.stringify(
                    {
                        statusCode: 201,
                        body: chunk.choices[0].delta.content || ''
                    } as HttpResponse
                ))
            }

            this._stream.end()
        } catch (e: any) {
            this._stream.write(JSON.stringify(
                {
                    statusCode: 500,
                    body: e?.message ?? "Unknown error"
                } as HttpResponse
            ))
            this._stream.end();
        }
    }
}


export function PASSWORD_RESET_TEMPLATE(link: any) {
    const file = fs.readFileSync('./html/password_reset_template.html', 'utf8');
    if (!file) throw new Error('File not found');
    return file.replace('${link}', link);
}