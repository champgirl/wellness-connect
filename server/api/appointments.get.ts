import { eq, sql } from "drizzle-orm";
import db from "~/db/db";
import { appointment } from "~/db/schema/appointment";
import { counselor } from "~/db/schema/counselor";
import { student } from "~/db/schema/student";
import type { HttpResponse, UserState } from "~/types"

async function getAppointments(pseudonym: string){
    const appointments = await db.select({
        id: appointment.id,
        counselorName: counselor.name,
        appointmentDateTime: appointment.appointmentDateTime,
        status: appointment.status
    }).from(appointment)
        .leftJoin(counselor, eq(appointment.counselorId, counselor.id))
        .leftJoin(student, eq(appointment.studentId, student.id))
        .where(
            sql`(${student.pseudonym} = ${pseudonym})`
        )
        .execute();

    return appointments;
}

export default defineEventHandler(async event => {
    const user = JSON.parse(getCookie(event, 'userState') || '{}') as UserState
    if (!user.name) { return { statusCode: 401, body: "Unauthorized" } as HttpResponse }

    const appointments = await getAppointments(user.name)

    const response = {} as HttpResponse

    response.statusCode = 200
    response.body = appointments

    return response
})