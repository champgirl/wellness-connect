import { mysqlTable, mysqlSchema, varchar, boolean, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const counselor = mysqlTable('counselor', {
    id: varchar('id', {length: 36}).notNull().primaryKey(),
    name: varchar('name', {length: 30}).default("Anonymous"),
    password: varchar('password', {length: 256}),
    email: varchar('email', {length: 30}),
    contact: varchar('contact', {length: 15}),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})


export type Counselor = typeof counselor.$inferSelect