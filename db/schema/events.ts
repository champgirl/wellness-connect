import {date, datetime, int, mysqlTable, time, varchar} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";
import {counselor} from "./counselor";

export const events = mysqlTable('events', {
    id: int('id').notNull().primaryKey().autoincrement(),
    title: varchar('title', {length: 30}).notNull(),
    description: varchar('description', {length: 30}),
    scheduleDate: date('schedule_date').notNull(),
    scheduleTime: time('schedule_time').notNull(),
    venue: varchar('venue', {length: 30}),
    counselor: int('counselor').notNull().references(() => counselor.id),
    cratedAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
})