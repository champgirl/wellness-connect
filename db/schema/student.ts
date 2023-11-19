import {mysqlTable, varchar, datetime, json, int} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {relations} from "drizzle-orm";
import {appointment} from "./appointment";

export const student = mysqlTable('student', {
    id: int('id').notNull().primaryKey().autoincrement(),
    name: varchar('name', {length: 30}).default("Anonymous"),
    pseudonym: varchar('pseudonym', {length: 30}).unique(),
    password: varchar('password', {length: 256}),
    email: varchar('email', {length: 1024}),
    contact: varchar('contact', {length: 1024}),
    reg_no: varchar('reg_no', {length: 20}),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})


export const studentRelations = relations(student, ({many}) => ({
    appointments: many(appointment)
}))


export type Student = typeof student.$inferSelect