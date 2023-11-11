import {defineEventHandler, createRouter} from "h3";
import type {HttpResponse} from "~/types";

const router = createRouter()

router.post('/register', defineEventHandler(async event => {
    console.log(await readBody(event))
    return {
        statusCode: 200,
        body: "Register Success"
    } as HttpResponse
}))

export default useBase('/api/auth', router.handler)