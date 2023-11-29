import type {LoginCredentials, UpdatePasswordRequest, RegisterCredentials, UserState} from "~/types";
import {z} from "zod";
import {H3Event} from "h3";
import * as crypto from "crypto";
import type {CounselorLoginCredentials, StudentLoginCredentials} from "~/types";
import {userEnum} from "~/types";

export function cleanLoginCredentials(data: LoginCredentials | null): LoginCredentials | null {
    if (!data || !data.password) return null

    if (data.hasOwnProperty("pseudonym")) {
        data = data as StudentLoginCredentials
        data.pseudonym = data.pseudonym.trim()
    } else if (data.hasOwnProperty("email")) {
        data = data as CounselorLoginCredentials
        data.email = data.email.trim()
    } else {
        return null
    }

    const schema = z.object({
        email: z.string().email().optional(),
        pseudonym: z.string().optional(),
        password: z.string()
    })

    try {
        schema.parse(data)
        return data
    } catch (e) {
        return null
    }
}

export async function cleanRegisterCredentials(data: RegisterCredentials): Promise<RegisterCredentials | null> {
    if (!data || !data.email || !data.password) return null

    data.email = data.email.trim().toLowerCase()
    data.contact = data.contact?.trim()
    data.name = data.name?.trim()

    if (!data.name || data.name.length < 1) data.name = data.email.split("@")[0].replace(".", " ").trim()

    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        bearer: z.string().optional(),
        contact: z.string().optional(),
        name: z.string(),
        reg_no: z.string().optional()
    })

    try {
        schema.parse(data)
        return data
    } catch (e) {
        console.error(e)
        return null
    }
}

export function cleanUpdatePasswordRequest(request: UpdatePasswordRequest): UpdatePasswordRequest | null {
    if (!request || !request.empsu || !request.token) return null

    request.empsu = request.empsu.trim().toLowerCase()
    request.token = request.token.trim()

    const schema = z.object({
        empsu: z.string(),
        token: z.string(),
        password: z.string().min(8),
        who: z.enum([userEnum.STUDENT, userEnum.COUNSELOR])
    })

    try {
        schema.parse(request)
        return request
    } catch (e) {
        return null
    }
}


export function readBearerToken(event: H3Event) {
    const bearer = event.node.req.headers['bearer'] || null
    if (!bearer || bearer.length < 1 || typeof bearer !== 'string') return null
    return bearer
}

export function hashData(plaintext: string): string {
    return crypto.createHash('sha256').update(plaintext).digest('hex')
}

export function checkHash(plaintext: string | null, hash: string | null): boolean {
    if (!plaintext || !hash) return false
    return hashData(plaintext) === hash
}


export function encryptData(plaintext: string, key: string){
    key = key.substring(0, 32);
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptData(encryptedText: string, key: string){
    key = key.substring(0, 32);
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}