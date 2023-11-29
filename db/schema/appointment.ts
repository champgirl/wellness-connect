import {datetime, int, mysqlTable} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";
import {student} from "./student";
import {counselor} from "./counselor";

export const appointment = mysqlTable('appointment', {
    id: int('id').notNull().primaryKey().autoincrement(),
    studentId: int('student_id').references(() => student.id).notNull(),
    counselorId: int('counselor_id').references(() => counselor.id).notNull(),
    appointmentDateTime: datetime('appointment_date_time').notNull(),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})

