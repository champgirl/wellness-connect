import type { Config } from "drizzle-kit";
import path from "path";
import 'dotenv/config';

export function checkBoolString(str: string | undefined): Boolean {
    if (str === undefined) return false;
    return str.trim().toLowerCase() === 'true';
}

export const config = {
    user: checkBoolString(process.env.DEV) ? process.env.DB_USER : process.env.DB_USER_PROD ?? 'root',
    password: checkBoolString(process.env.DEV) ? process.env.DB_PASS : process.env.DB_PASS_PROD ?? '',
    database: checkBoolString(process.env.DEV) ? process.env.DB_NAME : process.env.DB_NAME_PROD ?? `${path.basename(process.cwd())}`,
    poolMax: checkBoolString(process.env.DEV) ? process.env.DB_CONNECTION_LIMIT : process.env.DB_CONNECTION_LIMIT_PROD ?? 10,
    host: checkBoolString(process.env.DEV) ? process.env.DB_HOST : process.env.DB_HOST_PROD ?? 'localhost',
    port: checkBoolString(process.env.DEV) ? process.env.DB_PORT : process.env.DB_PORT_PROD ?? 3306,
}

const db_config: Config = {
    schema: "./db/schema/*",
    out: "./db/migrations",
    driver: "mysql2",
    breakpoints: false,
    dbCredentials: {
        user: config.user,
        password: config.password,
        database: config.database as string,
        port: Number(config.port),
        host: config.host as string
    }
}

export default db_config