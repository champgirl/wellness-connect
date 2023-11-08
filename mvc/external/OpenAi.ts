import {OpenAI, ClientOptions} from "openai";

const configuration = {
    apiKey: process.env.OPENAI_API_KEY
} as ClientOptions

export const openai = new OpenAI(configuration);