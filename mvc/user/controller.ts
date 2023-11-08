import {createRouter, defineEventHandler} from "h3";
import { registerUser } from "./functons";

const router = createRouter()

router.post('/register', defineEventHandler(event => {
    return registerUser(event)
}))

export default useBase('/api/user', router.handler)