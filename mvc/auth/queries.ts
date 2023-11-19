import type {
    CounselorLoginCredentials, CounselorRegister,
    LoginCredentials,
    PasswordResetRequest,
    RegisterCredentials, StudentLoginCredentials, StudentRegister,
    UpdatePasswordRequest,
    UserState
} from "~/types";
import {TokenType, userEnum} from '~/types';
import db from "~/db/db";
import {hashData, checkHash} from "~/mvc/auth/helpers";
import {v4 as uuidv4} from "uuid";
import {tokens} from "~/db/schema/tokens";
import {and, eq} from "drizzle-orm";
import {mailResetPasswordLink} from "~/mvc/utils";
import {counselor} from "~/db/schema/counselor";
import {student} from "~/db/schema/student";
import {names, uniqueNamesGenerator, type Config as namesConfig} from 'unique-names-generator';
import {composeNode} from "yaml/dist/compose/compose-node";

const configNames: namesConfig = {
    dictionaries: [names]
}


export async function loginStudent(data: StudentLoginCredentials, bearer: string | null = null): Promise<UserState | null> {
    let newToken

    const db_user = await getUserByPseudonym(data.pseudonym)

    if (!db_user) throw new Error("User does not exist")

    if (!checkHash(data.password, db_user.password)) throw new Error("Wrong Password")

    if (bearer) revokeToken(bearer, TokenType.BEARER, db_user.who!)

    newToken = await generateNewToken(db_user.id, TokenType.BEARER, db_user.who!)
        .catch((e) => {
            throw e as Error
        })

    if (!newToken) throw new Error("Unable to generate token")

    let userState = {} as UserState

    userState.id = db_user.id
    userState.name = db_user.pseudonym!
    userState.email = db_user.email!
    userState.token = newToken

    return userState
}

export async function loginCounselor(data: CounselorLoginCredentials, bearer: string | null = null): Promise<UserState | null> {
    let newToken

    const db_user = await getCounselorByEmail(data.email).catch(err => {
        console.error(err)
        throw err as Error
    })

    if (!db_user) throw new Error("User does not exist")

    if (!checkHash(data.password, db_user.password)) throw new Error("Wrong Password")

    if (bearer) revokeToken(bearer, TokenType.BEARER, db_user.who!)

    newToken = await generateNewToken(db_user.id, TokenType.BEARER, db_user.who!)
        .catch((e) => {
            throw e as Error
        })

    if (!db_user) return null
    if (!newToken) throw new Error("Unable to generate token")

    let userState = {} as UserState

    userState.id = db_user.id
    userState.name = db_user.name!
    userState.email = db_user.email!
    userState.token = newToken


    return userState
}

async function generateNewToken(user_id: number, type: string, who: userEnum): Promise<string> {
    const token = uuidv4()

    await db.insert(tokens).values({
        token: token,
        user_id: user_id,
        type: type,
        who: who
    }).catch((e) => {
        throw e
    })

    return token
}

export function loginUser(data: LoginCredentials, bearer: string | null) {
    if (data.hasOwnProperty("pseudonym")) {
        return loginStudent(data as StudentLoginCredentials, bearer)
    } else if (data.hasOwnProperty("email")) {
        return loginCounselor(data as CounselorLoginCredentials, bearer)
    } else {
        return null
    }
}

export function registerUser(data: RegisterCredentials) {
    if (data.hasOwnProperty('reg_no')) {
        return registerStudent(data as StudentRegister)
    } else {
        return registerCounselor(data as CounselorRegister)
    }
}

export async function registerCounselor(data: CounselorRegister): Promise<UserState | null> {
    let _user = await getCounselorByEmail(data.email)

    if (_user) throw new Error("User already exists")
    const {password, ...rest} = data

    await db.insert(counselor)
        .values({
            ...rest,
            password: hashData(password)
        }).catch((e) => {
            throw e as Error
        })

    return await loginCounselor({
        email: data.email,
        password: data.password
    })
}

async function registerStudent(data: StudentRegister) {
    let _user = await getStudentByEmail(data.email)
    if (_user) throw new Error("User already exists")

    const {password, ...rest} = data

    rest.email = hashData(data.email)

    const name = uniqueNamesGenerator(configNames)
    await db.insert(student)
        .values({
            ...rest,
            password: hashData(password),
            pseudonym: name
        })

    return await loginStudent({
        pseudonym: name,
        password: password
    })
}

export async function getUserFromToken(token: string, type: string, userType: userEnum): Promise<UserState | null> {
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


export async function getUserByPseudonym(name: string) {
    let userState = {} as UserState & { password: string, pseudonym: string }

    const result = await db.select({
        id: student.id,
        name: student.name,
        email: student.email,
        password: student.password,
        pseudonym: student.pseudonym
    }).from(student).where(eq(student.pseudonym, name))
        .limit(1)
        .catch((e) => {
            throw e as Error
        })

    if (!result || result.length == 0) return null

    userState.id = result[0].id
    userState.name = result[0].name!
    userState.email = result[0].email!
    userState.password = result[0].password!
    userState.pseudonym = result[0].pseudonym!

    return userState
}

async function getStudentByEmail(email: string) {
    const hashedEmail = hashData(email)

    const result = await db.select({
        id: student.id,
        name: student.name,
        email: student.email
    }).from(student)
        .where(eq(student.email, hashedEmail))
        .limit(1)
        .catch((e) => {
            throw e as Error
        })

    if (!result || result.length == 0) return null

    return result[0]
}

export async function logoutUser(bearer: string | null): Promise<boolean> {
    if (Array.isArray(bearer)) return false
    if (!bearer) return false

    db.update(tokens).set({
        isValid: false
    }).where(and(eq(tokens.token, bearer), eq(tokens.type, TokenType.BEARER)))
        .catch((e) => {
            console.error(e)
        })

    return true
}

async function resetUserTokens(id: string | number, type: string, who: userEnum): Promise<boolean> {
    if (typeof id === 'string') id = parseInt(id)
    await db.update(tokens).set({
        isValid: false
    }).where(and(
        eq(tokens.id, id),
        eq(tokens.type, type),
        eq(tokens.who, who)
    )).catch((e) => {
        throw e
    })

    return true
}

export async function getCounselorByEmail(email: string): Promise<UserState & { password: string } | null> {
    let result = await db.select({
        id: counselor.id,
        name: counselor.name,
        email: counselor.email,
        password: counselor.password
    }).from(counselor).where(eq(counselor.email, email))
        .limit(1)
        .catch((e) => {
            console.error(e)
            throw e as Error
        })

    if (!result || result.length == 0) return null

    let userState = {} as UserState & { who: string, password: string }
    userState.id = result[0].id
    userState.name = result[0].name!
    userState.email = result[0].email!
    userState.password = result[0].password!

    return userState
}

async function getValidatedCounselorByEmail(email: string, token: string, tokenType: string) {
    let result = await db.select({
        id: counselor.id,
        name: counselor.name,
        email: counselor.email
    }).from(counselor)
        .innerJoin(tokens, eq(tokens.id, counselor.id))
        .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(tokens.type, tokenType), eq(counselor.email, email)))

    if (!result || result.length === 0) throw new Error("Invalid token | User not found")

    return result[0] || null
}

async function getValidateStudentByEmail(email: string, token: string, tokenType: string) {
    email = hashData(email)

    let result = await db.select({
        id: student.id,
        pseudonym: student.pseudonym,
        email: student.email
    }).from(student)
        .innerJoin(tokens, eq(tokens.id, student.id))
        .where(and(eq(tokens.isValid, true), eq(tokens.token, token), eq(student.email, email), eq(tokens.type, tokenType)))

    if (!result || result.length === 0) throw new Error("Invalid token | User not found")

    return result[0] || null
}

async function revokeToken(token: string, type: string, who: userEnum) {
    await db.update(tokens).set({
        isValid: false,
        type: type
    }).where(and(eq(tokens.token, token), eq(tokens.who, who)))
        .catch((e) => {
            throw e
        })

    return true
}

export async function updateCounselorPassword(data: UpdatePasswordRequest): Promise<UserState | null> {
    const user = await getValidatedCounselorByEmail(data.empsu, data.token, TokenType.PASSWORD_RESET)
        .catch((e) => {
            throw e as Error
        })

    let result = await db.update(counselor)
        .set({
            password: hashData(data.password)
        }).where(eq(counselor.id, user.id))
        .catch((e) => {
            throw e as Error
        })

    if (!result) throw new Error("Failed to update user")

    await resetUserTokens(user.id, TokenType.PASSWORD_RESET, data.who)
        .catch((e) => {
            throw e as Error
        })

    let loginCredentials = {} as CounselorLoginCredentials
    loginCredentials.email = user.email!
    loginCredentials.password = data.password

    return await loginCounselor(loginCredentials, null).catch((e) => {
        throw e as Error
    })
}

export async function updateStudentPassword(data: UpdatePasswordRequest): Promise<UserState | null> {
    const user = await getValidateStudentByEmail(data.empsu, data.token, TokenType.PASSWORD_RESET)
        .catch((e) => {
            throw e as Error
        })

    let result = await db.update(student)
        .set({
            password: hashData(data.password)
        }).where(eq(student.id, user.id))
        .catch((e) => {
            throw e as Error
        })

    if (!result) throw new Error("Failed to update user")

    await resetUserTokens(user.id, TokenType.PASSWORD_RESET, data.who)
        .catch((e) => {
            throw e as Error
        })

    let loginCredentials = {} as StudentLoginCredentials
    loginCredentials.pseudonym = user.pseudonym!
    loginCredentials.password = data.password

    return await loginStudent(loginCredentials, null).catch((e) => {
        throw e as Error
    })
}

export async function requestPasswordReset(data: PasswordResetRequest): Promise<boolean> {
    let user: any = await getCounselorByEmail(data.email)
        .catch((e) => {
            throw e as Error
        })

    let who = userEnum.COUNSELOR
    if (!user) {
        user = await getStudentByEmail(data.email)
            .catch((e) => {
                throw e as Error
            })

        who = userEnum.STUDENT
    }

    if (!user) throw new Error("User not found")

    const token = await generateNewToken(user.id, TokenType.PASSWORD_RESET, who)
        .catch((e) => {
            console.error(e)
            throw new Error("Failed to generate token")
        })

    await mailResetPasswordLink(data.email, token, data.origin, data.path, who)
        .catch((e) => {
            throw e as Error
        })

    return true
}