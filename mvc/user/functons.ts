import { H3Event } from "h3";

export function registerUser(event: H3Event) {
    console.log(event)
    return {
        status: 200,
        body: "Success"
    }
}