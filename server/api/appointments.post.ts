import db from '~/db/db' // drizzle
import { appointment } from '~/db/schema/appointment'
import { counselor } from '~/db/schema/counselor'
import { sql, eq } from 'drizzle-orm'
import { HttpResponse, UserState } from '~/types';
import { getUserByPseudonym } from '~/mvc/auth/queries';

async function isAvailableCounselors(dateTime: Date) {
    const availableCounselors = await db.select({
        id: counselor.id,
        name: counselor.name
    }).from(counselor)
        .leftJoin(appointment, eq(counselor.id, appointment.counselorId))
        .where(
            sql`(${appointment.appointmentDateTime} IS NULL OR ${appointment.appointmentDateTime} <> ${dateTime})`
        )
        .execute();

    return availableCounselors;
}


async function makeAppointment(pseudonym: string, counselorId: number, dateTime: Date) {
    await db.insert(appointment)
        .values({
            studentId: await getUserByPseudonym(pseudonym).then(user => {
                if(!user) throw new Error("User not found")
                return user.id
            }),
            counselorId: counselorId,
            appointmentDateTime: new Date(dateTime)
        })
}

export default defineEventHandler(async event => {
    const data = await readBody(event)

    const available = await isAvailableCounselors(data.dateTime)

    if (available.length > 0) {
        const user = JSON.parse(getCookie(event, 'userState') || '{}') as UserState
        if (!user.name) { return { statusCode: 401, body: "Unauthorized" } as HttpResponse }

        const randomCounselor = available[Math.floor(Math.random() * available.length)] || available[0]
        await makeAppointment(user.name, randomCounselor.id, data.dateTime)

        event.node.res.statusCode = 200
        return {
            statusCode: 200,
            body: {
                counselor: randomCounselor.name,
                dateTime: data.dateTime
            }
        } as HttpResponse
    }

    return {
        statusCode: 400,
        body: "No available counselors"
    } as HttpResponse
})