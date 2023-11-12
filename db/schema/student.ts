import {mysqlTable, varchar, datetime, json} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {relations} from "drizzle-orm";
import {appointment} from "~/db/schema/appointment";

export const student = mysqlTable('student', {
    id: varchar('id', {length: 36}).notNull().default(sql`AUTO_INCREMENT`).primaryKey(),
    name: varchar('name', {length: 30}).default("Anonymous"),
    psuedonym: varchar('psuedonym', {length: 30}),
    password: varchar('password', {length: 256}),
    email: varchar('email', {length: 1024}),
    contact: varchar('contact', {length: 1024}),
    chats: json('chats'),
    reg_no: varchar('reg_no', {length: 20}),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})


export const studentRelations = relations(student, ({many}) => ({
    appointments: many(appointment)
}))


export type Student = typeof student.$inferSelect