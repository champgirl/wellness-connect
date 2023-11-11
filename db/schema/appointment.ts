import {datetime, json, mysqlTable, varchar} from "drizzle-orm/mysql-core/index";
import {sql} from "drizzle-orm";
import {student} from "~/db/schema/student";
import {counselor} from "~/db/schema/counselor";

export const appointment = mysqlTable('appointment', {
    id: varchar('id', {length: 36}).notNull().primaryKey(),
    student_id: varchar('student_id', {length: 36}).references(() => student.id),
    counselor_id: varchar('counselor_id', {length: 36}).references(() => counselor.id),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})

