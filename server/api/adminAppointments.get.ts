import { HttpResponse, UserState } from "~/types"
import db from "~/db/db"
import { appointment } from "~/db/schema/appointment"
import { counselor } from "~/db/schema/counselor"
import { student } from "~/db/schema/student"
import { eq, sql } from "drizzle-orm"

async function getCounselorAppointments(email: string) {
    return db.select({
        id: appointment.id,
        counselorName: counselor.name,
        studentName: student.pseudonym,
        appointmentDateTime: appointment.appointmentDateTime,
        status: appointment.status
    }).from(appointment)
        .leftJoin(counselor, eq(appointment.counselorId, counselor.id))
        .leftJoin(student, eq(appointment.studentId, student.id))
        .where(
            sql`(${counselor.email} = ${email})`
        )
        .execute();
}

export default defineEventHandler(async event => {
    const user = JSON.parse(getCookie(event, 'userState') || '{}') as UserState
    if (!user.name) { return { statusCode: 401, body: "Unauthorized" } as HttpResponse }

    const appointments = await getCounselorAppointments(user.email)

    const response = {} as HttpResponse

    response.statusCode = 200
    response.body = appointments

    return response
})