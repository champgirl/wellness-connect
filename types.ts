import type {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";

export enum userEnum {
    COUNSELOR = 'counselor',
    STUDENT = 'student'
}

export type GPTChat = {
    model: "gpt-3.5-turbo";
    messages: ChatCompletionMessageParam[];
}

export type HttpResponse = {
    statusCode: number;
    body?: any;
}

export const allowedChatInterval = 1000 * 3 // 3 seconds

export type UserStateType = {
    user_id: String,
    bearer: String,
    is_admin: String
}


export type CounselorRegister = {
    name: string,
    email: string,
    password: string,
    contact: string
}

export type StudentRegister = {
    name: string,
    email: string,
    password: string,
    contact: string,
    reg_no: string
}

export type LoginCredentials = {
    email: string;
    password: string;
}


export type RegisterCredentials = StudentRegister | CounselorRegister

export type RegistrationError = {
    error?: any;
    message: string;
}

export type APIResponse = {
    statusCode: number;
    body?: any;
}

export type UserState = {
    id: string;
    email: string;
    name: string;
    token: string;
}

export type UserCookie = {
    bearer: string;
}

export type UpdatePasswordRequest = {
    token: string;
    email: string;
    password: string;
    who: userEnum;
}

export type PasswordResetRequest = {
    email: string;
    origin: string;
    path: string;
}

export const TokenType = {
    EMAIL_VERIFICATION: 'email_verification',
    PASSWORD_RESET: 'password_reset',
    BEARER: 'bearer'
}
