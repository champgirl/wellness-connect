import type {
    CounselorRegister,
    LoginCredentials,
    PasswordResetRequest,
    RegisterCredentials,
    UpdatePasswordRequest,
    UserState
} from "~/types";
import {TokenType, user} from '~/types';
import db from "~/db/db";
import {hashPassword, verifyPassword} from "~/mvc/auth/helpers";
import {v4 as uuidv4} from "uuid";
import {tokens} from "~/db/schema/token";
import {ulid} from "ulid";
import {and, eq} from "drizzle-orm";
import {mailResetPasswordLink} from "~/mvc/utils";
import {counselor} from "~/db/schema/counselor";
import {student} from "~/db/schema/student";

export async function loginUser(data: LoginCredentials, bearer: string | null = null, who: user): Promise<UserState | null> {
    let db_user
    let newToken

    if (who === user.COUNSELOR) {
        const result = await db.select({
            id: counselor.id,
            name: counselor.name,
            email: counselor.email,
            password: counselor.password
        }).from(counselor).where(eq(counselor.email, data.email))
            .catch((e) => {
                throw e as Error
            })

        if (result.length < 1) return null

        db_user = result[0]

        if (!verifyPassword(data.password, db_user.password)) return null

        if (bearer) revokeToken(bearer, TokenType.BEARER)

        newToken = await generateNewToken(db_user.id, TokenType.BEARER)
            .catch((e) => {
                throw e as Error
            })
    } else if (who === user.STUDENT) {
        const result = await db.select({
            id: student.id,
            name: student.name,
            email: student.email,
            password: student.password
        }).from(student).where(eq(student.email, data.email))
            .catch((e) => {
                throw e as Error
            })

        if (result.length < 1) return null

        db_user = result[0]
        if (!verifyPassword(data.password, db_user.password)) return null

        if (bearer) revokeToken(bearer, TokenType.BEARER)

        newToken = await generateNewToken(db_user.id, TokenType.BEARER)
            .catch((e) => {
                throw e as Error
            })
    } else {
        throw new Error("No such user type")
    }

    if (!db_user) return null
    if (!newToken) throw new Error("Unable to generate token")

    let userState = {} as UserState

    userState.id = db_user.id
    userState.name = db_user.name!
    userState.email = db_user.email!
    userState.token = newToken

    return userState
}

async function generateNewToken(user_id: string, type: string): Promise<string> {
    const token = uuidv4()

    await db.insert(tokens).values({
        token: token,
        user_id: user_id,
        type: type
    }).catch((e) => {
        throw e
    })

    return token
}

export async function registerUser(data: RegisterCredentials): Promise<UserState | null> {
    let _user = await getUserByEmail(data.email)

    if (_user) throw new Error("User already exists")

    if(data.hasOwnProperty("reg_no")){
        await db.insert(student).values({
            name: data.name,
            password: hashPassword(data.password),
            email: data.email,
            reg_no: data.reg_no
        })

        return await loginUser({
            email: data.email,
            password: data.password
        }, null)
    } else {
        await db.update(users).set({
            isEphemeral: false,
            name: data.name,
            password: hashPassword(data.password),
            email: data.email
        }).where(eq(users.user_id, user.user_id))
            .catch((e) => {
                throw e as Error
            })

        return await loginUser({
            email: data.email,
            password: data.password
        }, null)
    }
}

async function getUserByUserId(user_id: string): Promise<User & UserState | null> {
    const result = await db.select({
        user_id: users.user_id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin,
        isEphemeral: users.isEphemeral
    }).from(users).where(eq(users.user_id, user_id))
        .catch((e) => {
            throw e
        })

    if (result.length < 1) return null

    const user = result[0]

    let userState = {} as User & UserState
    userState.user_id = user.user_id
    userState.name = user.name!
    userState.email = user.email!
    userState.is_admin = user.isAdmin!
    userState.isEphemeral = user.isEphemeral!

    return userState
}

export async function createEphemeralUser(): Promise<User & UserState | null> {
    const bearer = uuidv4()
    let user_id = ulid()
    let user = {} as User & UserState

    await db.insert(users).values({
        user_id: user_id,
        isEphemeral: true
    }).catch(
        (e) => {
            console.log(e)
            throw e as Error
        })

    await db.insert(tokens).values({
        token: bearer,
        user_id: user_id,
        type: TokenType.BEARER
    }).catch(
        (e) => {
            console.log(e)
            throw e as Error
        })

    // Because this is mySql, we can't yet return a table after insert using drizzle-orm yet, use Postgres for that
    // TODO: Consider using Postgres for this project
    const result = await db.select({
        user_id: users.user_id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin,
        isEphemeral: users.isEphemeral
    }).from(users)
        .where(eq(users.user_id, user_id))
        .limit(1)
        .catch(
            (e) => {
                throw e as Error
            })

    if (!result) return null

    user.user_id = result[0].user_id
    user.name = result[0].name!
    user.email = result[0].email!
    user.token = bearer
    user.is_admin = result[0].isAdmin!
    user.isEphemeral = result[0].isEphemeral!

    return user
}

async function getUserFromToken(token: string, type: string): Promise<UserState | null> {
    let userState = {} as UserState
    const result = await db.select({
        user_id: users.user_id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin
    }).from(users)
        .innerJoin(tokens, eq(tokens.user_id, users.user_id))
        .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, type)))

    if (!result || result.length === 0) return null

    userState.user_id = result[0].user_id
    userState.name = result[0].name!
    userState.email = result[0].email!
    userState.is_admin = result[0].isAdmin!
    userState.token = token

    return userState
}

export async function identifyUser(bearer: string | null): Promise<UserState | null> {
    if (Array.isArray(bearer)) throw new Error("Invalid headers | More than one bearer token")
    if (!bearer) return await createEphemeralUser()

    return await getUserFromToken(bearer, TokenType.BEARER)
}


export async function logoutUser(bearer: string | null): Promise<boolean> {
    if (Array.isArray(bearer)) return false
    if (!bearer) return false

    db.update(tokens).set({
        isValid: false
    }).where(and(eq(tokens.token, bearer), eq(tokens.type, TokenType.BEARER)))
        .catch((e) => {
            throw e as Error
        })

    return true
}

async function resetUserTokens(user_id: string, type: string): Promise<boolean> {
    await db.update(tokens).set({
        isValid: false
    }).where(and(eq(tokens.user_id, user_id), eq(tokens.type, type)))
        .catch((e) => {
            throw e
        })

    return true
}

export async function getUserByEmail(email: string): Promise<UserState | null> {
    const result = await db.select({
        user_id: users.user_id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin
    }).from(users).where(eq(users.email, email))
        .limit(1)
        .catch((e) => {
            throw e as Error
        })

    if (!result || result.length == 0) return null

    let userState = {} as UserState
    userState.user_id = result[0].user_id
    userState.name = result[0].name!
    userState.email = result[0].email!
    userState.is_admin = result[0].isAdmin!

    return userState
}

async function getValidatedUserByEmail(email: string, token: string, tokenType: string) {
    const result = await db.select({
        user_id: users.user_id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin
    }).from(users)
        .innerJoin(tokens, eq(tokens.user_id, users.user_id))
        .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, tokenType), eq(users.email, email)))

    if (!result || result.length === 0) throw new Error("Invalid token | User not found")

    return result[0] || null
}

async function revokeToken(token: string, type: string) {
    await db.update(tokens).set({
        isValid: false,
        type: type
    }).where(eq(tokens.token, token))
        .catch((e) => {
            throw e
        })

    return true
}

export async function updateUserPassword(data: UpdatePasswordRequest): Promise<UserState | null> {
    const user = await getValidatedUserByEmail(data.email, data.token, TokenType.PASSWORD_RESET)
        .catch((e) => {
            throw e as Error
        })

    const result = await db.update(users)
        .set({
            password: hashPassword(data.password)
        }).where(eq(users.user_id, user.user_id))
        .catch((e) => {
            throw e as Error
        })

    if (!result) throw new Error("Failed to update user")

    await resetUserTokens(user.user_id, TokenType.PASSWORD_RESET)
        .catch((e) => {
            throw e as Error
        })

    let loginCredentials = {} as LoginCredentials
    loginCredentials.email = user.email!
    loginCredentials.password = data.password

    return await loginUser(loginCredentials).catch((e) => {
        throw e as Error
    })
}

export async function requestPasswordReset(data: PasswordResetRequest): Promise<boolean> {
    const user = await getUserByEmail(data.email)
        .catch((e) => {
            throw e as Error
        })

    if (!user) throw new Error("User not found")

    const token = await generateNewToken(user.user_id, TokenType.PASSWORD_RESET)
        .catch((e) => {
            throw new Error("Failed to generate token")
        })

    await mailResetPasswordLink(data.email, token, origin, data.path)
        .catch((e) => {
            throw e as Error
        })

    return true
}