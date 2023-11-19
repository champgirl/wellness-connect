import {H3Event} from "h3";
import type {APIResponse, LoginCredentials, PasswordResetRequest, RegisterCredentials, UserState} from "~/types";
import {
    loginUser,
    registerUser,
    logoutUser,
    updateCounselorPassword,
    requestPasswordReset, updateStudentPassword
} from "~/mvc/auth/queries";

import {
    cleanLoginCredentials,
    cleanUpdatePasswordRequest,
    cleanRegisterCredentials,
    readBearerToken,
} from "~/mvc/auth/helpers";
import {userEnum} from "~/types";


export async function login(event: H3Event): Promise<APIResponse> {
    const data = await readBody(event) as LoginCredentials || null
    let response = {} as APIResponse


    const cleanedLoginData = cleanLoginCredentials(data)
    if (!cleanedLoginData) {
        response.statusCode = 400
        response.body = "Invalid credentials format"
        return response
    }
    const bearer = readBearerToken(event)

    const result = await loginUser(cleanedLoginData, bearer)?.catch(e => {
        return e as Error
    })

    if (!result) {
        response.statusCode = 401
        response.body = "Invalid credentials"
        return response
    }

    if(result instanceof  Error){
        response.statusCode = 500
        response.body = result.message
        return response
    }


    response.statusCode = 200
    response.body = result

    return response
}

export async function register(event: H3Event): Promise<APIResponse> {
    const data = await readBody(event) as RegisterCredentials & { bearer?: string | null }
    data.bearer = readBearerToken(event) || ''
    let response = {} as APIResponse

    const cleanedRegisterData = await cleanRegisterCredentials(data)
    if (!cleanedRegisterData) {
        response.statusCode = 400
        response.body = "Invalid credentials format"
        return response
    }

    const result: UserState | Error | null = await registerUser(cleanedRegisterData)
        .catch((e) => {
            return e as Error
        })

    if (!result || result instanceof Error) {
        response.statusCode = 500
        response.body = result?.message || "Internal server error"
        return response
    }

    response.statusCode = 200
    response.body = result

    return response
}

export async function logout(event: H3Event): Promise<APIResponse> {
    let response = {} as APIResponse
    const bearer = readBearerToken(event)
    const result = await logoutUser(bearer)
        .catch((e) => {
            console.error(e)
            response.statusCode = 500
            response.body = `Internal server error | ${e.message}`
            return response
        })

    if (!result) {
        response.statusCode = 404
        response.body = "Not found"
        return response
    }

    response.statusCode = 200
    response.body = "Logged out"
    return response
}

export async function updatePassword(event: H3Event): Promise<APIResponse> {
    let data = await readBody(event)
    let response = {} as APIResponse

    data = cleanUpdatePasswordRequest(data)
    if (!data) {
        response.statusCode = 400
        response.body = "Invalid request"
        return response
    }

    let result;
    if(data.who === userEnum.COUNSELOR) {
        result = await updateCounselorPassword(data)
            .catch((e) => e as Error)
    } else {
        result = await updateStudentPassword(data)
            .catch((e) => e as Error)
    }

    if (result instanceof Error) {
        response.statusCode = 500
        response.body = result.message
        return response
    }

    response.statusCode = 200
    response.body = result
    return response
}

export async function requestReset(event: H3Event): Promise<APIResponse> {
    let response = {} as APIResponse
    const data = await readBody(event) as PasswordResetRequest
    const result = await requestPasswordReset(data)
        .catch((e) => {
            return e as Error
        })

    if (result instanceof Error) {
        response.statusCode = 400
        response.body = result.message
        return response
    }

    response.statusCode = 200
    response.body = "Reset link sent to email"

    return response
}