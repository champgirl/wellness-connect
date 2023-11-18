import {datetime, int, mysqlTable, varchar} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";
import {student} from "./student";
import {counselor} from "./counselor";

export const appointment = mysqlTable('appointment', {
    id: int('id').notNull().primaryKey().autoincrement(),
    student_id: int('student_id').references(() => student.id),
    counselor_id: int('counselor_id').references(() => counselor.id),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})

