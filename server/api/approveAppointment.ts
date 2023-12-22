import { eq } from "drizzle-orm"
import db from "~/db/db"
import { appointment } from "~/db/schema/appointment"

export default defineEventHandler(async event => {
    const {id} = await readBody(event)

    await db.update(appointment).set({status: 1}).where(eq(appointment.id, id)).execute()

    event.node.res.statusCode = 200
    return {
        statusCode: 200,
        body: "Success"
    }
})