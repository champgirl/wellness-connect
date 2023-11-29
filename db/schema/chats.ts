import {datetime, int, mysqlTable, boolean} from "drizzle-orm/mysql-core";
import {json} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";
import {student} from "./student";

export const chats = mysqlTable('chats', {
    id: int('id').notNull().primaryKey().autoincrement(),
    studentId: int('student_id').notNull().references(() => student.id),
    chats: json('chats'),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})

export type Chat = typeof chats.$inferInsert