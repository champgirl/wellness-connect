import type {Chat} from "~/db/schema/chats";
import db from "~/db/db";
import {chats} from "~/db/schema/chats";
import {eq, and} from "drizzle-orm";
import { student } from "~/db/schema/student";
import {decryptData, encryptData} from "~/mvc/auth/helpers";

export async function storeChat(chat: Chat) {
    // check if chat exists using the student id
    const existingChat = await db.select({
        studentId: chats.studentId
    }).from(chats).where(and(eq(chats.studentId, chat.studentId), eq(chats.isDeleted, false)))
        .then(data => {
            if (data) return data[0]
            return null
        })
        .catch((e) => {
            throw e as Error
        })

    // if it exists, updates it
    if (existingChat) {
        await db
            .update(chats)
            .set(chat)
            .where(eq(chats.studentId, chat.studentId))
            .catch((e) => {
                throw e as Error
            })

        return true
    } else {
        // otherwise create it
        await db
            .insert(chats)
            .values(chat)
            .then(() => {
                return chat
            })
            .catch((e) => {
                throw e as Error
            })
    }
    return true
}

export async function getChats(studentId: number) {
    const result = await db
        .select()
        .from(chats)
        .where(and(eq(chats.studentId, studentId), eq(chats.isDeleted, false)))
        .catch((e) => {
            throw e as Error
        })

    return result[0] || null
}

export function getChat(id: number) {
    return db
        .select()
        .from(chats)
        .where(eq(chats.id, id))
        .catch((e) => {
            throw e as Error
        })
}

export async function deleteUserChat(user_id: string | number) {
    const id = +user_id

    await db.update(chats).set({
        isDeleted: true
    }).where(eq(chats.studentId, id))
        .catch(err => {
            throw err
        })

    return true
}

export async function getStudentById(id: number) {
    const result = await db.select().from(student).where(eq(student.id, id))

    return result[0] || null
}

export async function flagChat(studentId: number) {
    await db.update(chats).set({
        isFlagged: true
    }).where(and(eq(chats.studentId, studentId), eq(chats.isDeleted, false)))
        .catch(err => {
            throw err
        })

    return await getChats(studentId)
}


export async function getFlaggedChats(){
    const result = await db.select({
        id: chats.id,
        studentName: student.name,
        reg_no: student.reg_no,
        createdAt: chats.cratedAt,
        isReviewed: chats.isReviewed,
        isFlagged: chats.isFlagged,
        email: student.email,
        contact: student.contact
    }).from(chats).where(eq(chats.isFlagged, true)).innerJoin(student, eq(chats.studentId, student.id))
    console.log(result)

    const data = result.map(chat => {
        return {
            id: chat.id,
            createdAt: chat.createdAt,
            isReviewed: chat.isReviewed,
            isFlagged: chat.isFlagged,
            email: chat.email,
            contact: decryptData(chat.contact!, chat.email!),
            studentName: decryptData(chat.studentName!, chat.email!),
            reg_no: decryptData(chat.reg_no!, chat.email!)
        }
    })

    console.log(data)
    return data
}