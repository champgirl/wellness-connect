import { mysqlTable, mysqlSchema, varchar, boolean, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable('users', {
    user_id: varchar('user_id', {length: 32}).notNull().primaryKey(),
    name: varchar('name', {length: 20}).default("Anonymous"),
    password: varchar('password', {length: 256}),
    email: varchar('email', {length: 30}),
    isEphemeral: boolean('is_ephemeral').default(true),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    isAdmin: boolean('is_admin').default(false)
})