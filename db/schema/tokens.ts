import {mysqlTable, int, varchar, boolean, datetime, mysqlEnum} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";
import {TokenType, userEnum} from "../../types";

export const tokens = mysqlTable('tokens', {
    id: int('id').primaryKey().autoincrement(),
    token: varchar('token', {length: 36}).notNull(),
    isValid: boolean('is_valid').default(true),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    user_id: int('user_id').notNull(),
    who: mysqlEnum('who', [userEnum.COUNSELOR, userEnum.STUDENT]),
    type: mysqlEnum('type', [TokenType.EMAIL_VERIFICATION, TokenType.PASSWORD_RESET, TokenType.BEARER]).notNull()
})
