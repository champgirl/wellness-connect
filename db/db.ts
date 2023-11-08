import {drizzle} from "drizzle-orm/mysql2";
import type {MySql2Database} from "drizzle-orm/mysql2";

import mysql from "mysql2/promise";
import {config} from "~/drizzle.config";
import {checkBoolString} from "~/drizzle.config";

const poolConnection: mysql.Pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: Number(config.poolMax),
    port: Number(config.port),
    ssl: checkBoolString(process.env.DEV) ? undefined : {
        rejectUnauthorized: false
    }
});

console.log(`Connected to ${config.database} on ${config.host}:${config.port} as ${config.user}`);

const db: MySql2Database = drizzle(poolConnection);
export default db;