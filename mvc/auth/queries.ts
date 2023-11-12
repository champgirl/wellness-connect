import type {
    LoginCredentials,
    PasswordResetRequest,
    RegisterCredentials,
    UpdatePasswordRequest,
    UserState
} from "~/types";
import {TokenType, userEnum} from '~/types';
import db from "~/db/db";
import {hashPassword, verifyPassword} from "~/mvc/auth/helpers";
import {v4 as uuidv4} from "uuid";
import {tokens} from "~/db/schema/tokens";
import {and, eq} from "drizzle-orm";
import {mailResetPasswordLink} from "~/mvc/utils";
import {counselor} from "~/db/schema/counselor";
import {student} from "~/db/schema/student";
import type {Config as namesConfig} from 'unique-names-generator';
import {names, uniqueNamesGenerator} from 'unique-names-generator';
import {undefined} from "zod";

const configNames: namesConfig = {
    dictionaries: [names]
}


export async function loginUser(data: LoginCredentials, bearer: string | null = null, who: userEnum): Promise<UserState | null> {
    let db_user
    let newToken

    if (who === userEnum.COUNSELOR) {
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

        if (bearer) revokeToken(bearer, TokenType.BEARER, who)

        newToken = await generateNewToken(db_user.id, TokenType.BEARER)
            .catch((e) => {
                throw e as Error
            })
    } else if (who === userEnum.STUDENT) {
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

        if (bearer) revokeToken(bearer, TokenType.BEARER, who)

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

    if (data.hasOwnProperty("reg_no")) {
        data.password = hashPassword(data.password)

        await db.insert(student)
            .values({
                ...data,
                psuedonym: uniqueNamesGenerator(configNames)
            })

        return await loginUser({
            email: data.email,
            password: data.password
        }, null, userEnum.STUDENT)

    } else {
        data.password = hashPassword(data.password)

        await db.insert(counselor)
            .values(data)

        return await loginUser({
            email: data.email,
            password: data.password
        }, null, userEnum.COUNSELOR)
    }
}

async function getUserByUserId(id: string | number, who: userEnum): Promise<UserState | null> {
    if (typeof id === "string") id = parseInt(id)
    let result;

    if (who === userEnum.COUNSELOR) {
        result = await db.select({
            id: counselor.id,
            name: counselor.name,
            email: counselor.email
        }).from(counselor).where(eq(counselor.id, id))
            .catch((e) => {
                throw e
            })
    } else if (who === userEnum.STUDENT) {
        result = await db.select({
            id: student.id,
            name: student.name,
            email: student.email
        }).from(student).where(eq(student.id, id))
            .catch((e) => {
                throw e
            })
    }


    if (!result || result.length < 1) return null

    const user = result[0]

    let userState = {} as UserState

    userState.id = user.id
    userState.name = user.name!
    userState.email = user.email!

    return userState
}

async function getUserFromToken(token: string, type: string, userType: userEnum): Promise<UserState | null> {
    let userState = {} as UserState
    let result;
    if (userType === userEnum.COUNSELOR) {
        result = await db.select({
            id: counselor.id,
            name: counselor.name,
            email: counselor.email
        }).from(counselor)
            .innerJoin(tokens, eq(tokens.id, counselor.id))
            .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, type)))
    } else if (userType === userEnum.STUDENT) {
        result = await db.select({
            id: student.id,
            name: student.name,
            email: student.email
        }).from(student)
            .innerJoin(tokens, eq(tokens.id, student.id))
            .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, type)))
    }

    if (!result || result.length === 0) return null

    userState.id = result[0].id
    userState.name = result[0].name!
    userState.email = result[0].email!
    userState.token = token

    return userState
}

export async function identifyUser(bearer: string, who: userEnum): Promise<UserState | null> {
    if (Array.isArray(bearer)) throw new Error("Invalid headers | More than one bearer token")
    return await getUserFromToken(bearer, TokenType.BEARER, who)
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

async function resetUserTokens(id: string, type: string, who: userEnum): Promise<boolean> {
    await db.update(tokens).set({
        isValid: false
    }).where(and(eq(tokens.id, id), eq(tokens.type, type)), eq(tokens.who, who))
        .catch((e) => {
            throw e
        })

    return true
}

export async function getUserByEmail(email: string): Promise<UserState | null> {
    let result = await db.select({
        id: counselor.id,
        name: counselor.name,
        email: counselor.email
    }).from(counselor).where(eq(counselor.email, email))
        .limit(1)
        .catch((e) => {
            throw e as Error
        })

    if (!result || result.length == 0) {
        await db.select({
            id: counselor.id,
            name: counselor.name,
            email: counselor.email
        }).from(counselor).where(eq(counselor.email, email))
            .limit(1)
            .catch((e) => {
                throw e as Error
            })
    }

    if (!result || result.length == 0) return null

    let userState = {} as UserState
    userState.id = result[0].id
    userState.name = result[0].name!
    userState.email = result[0].email!

    return userState
}

async function getValidatedUserByEmail(email: string, token: string, tokenType: string, who: userEnum) {
    let result = await db.select({
        id: student.id,
        name: student.name,
        email: student.email
    }).from(student)
        .innerJoin(tokens, eq(tokens.id, student.id))
        .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, tokenType), eq(student.email, email)))

    if (!result || result.length == 0) {
        await db.select({
            id: counselor.id,
            name: counselor.name,
            email: counselor.email
        }).from(counselor)
            .innerJoin(tokens, eq(tokens.id, counselor.id))
            .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, tokenType), eq(counselor.email, email)))
    }

    if (!result || result.length === 0) throw new Error("Invalid token | User not found")

    return result[0] || null
}

async function revokeToken(token: string, type: string, who: userEnum) {
    await db.update(tokens).set({
        isValid: false,
        type: type
    }).where(eq(tokens.token, token), eq(tokens.who, who))
        .catch((e) => {
            throw e
        })

    return true
}

export async function updateUserPassword(data: UpdatePasswordRequest): Promise<UserState | null> {
    const user = await getValidatedUserByEmail(data.email, data.token, TokenType.PASSWORD_RESET, data.who)
        .catch((e) => {
            throw e as Error
        })

    let result;

    if (data.who === userEnum.STUDENT) {
        result = await db.update(student)
            .set({
                password: hashPassword(data.password)
            }).where(eq(student.id, user.id))
            .catch((e) => {
                throw e as Error
            })
    } else if (data.who === userEnum.COUNSELOR) {
        result = await db.update(counselor)
            .set({
                password: hashPassword(data.password)
            }).where(eq(counselor.id, user.id))
            .catch((e) => {
                throw e as Error
            })
    }

    if (!result) throw new Error("Failed to update user")

    await resetUserTokens(user.id, TokenType.PASSWORD_RESET, data.who)
        .catch((e) => {
            throw e as Error
        })

    let loginCredentials = {} as LoginCredentials
    loginCredentials.email = user.email!
    loginCredentials.password = data.password

    return await loginUser(loginCredentials, null, data.who).catch((e) => {
        throw e as Error
    })
}

export async function requestPasswordReset(data: PasswordResetRequest): Promise<boolean> {
    const user = await getUserByEmail(data.email)
        .catch((e) => {
            throw e as Error
        })

    if (!user) throw new Error("User not found")

    const token = await generateNewToken(user.id, TokenType.PASSWORD_RESET)
        .catch((e) => {
            throw new Error("Failed to generate token")
        })

    await mailResetPasswordLink(data.email, token, origin, data.path)
        .catch((e) => {
            throw e as Error
        })

    return true
}