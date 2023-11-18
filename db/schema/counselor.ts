import { mysqlTable, varchar, datetime, int } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const counselor = mysqlTable('counselor', {
    id: int('id').notNull().primaryKey().autoincrement(),
    name: varchar('name', {length: 30}).default("Anonymous"),
    password: varchar('password', {length: 256}),
    email: varchar('email', {length: 30}),
    contact: varchar('contact', {length: 15}),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})


export type Counselor = typeof counselor.$inferSelect