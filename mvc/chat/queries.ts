import type {Chat} from "~/db/schema/chats";
import db from "~/db/db";
import {chats} from "~/db/schema/chats";
import {eq} from "drizzle-orm";

export async function storeChat(chat: Chat) {
    // check if chat exists using the student id
    const existingChat = await db.select({
        studentId: chats.studentId
    }).from(chats).where(eq(chats.studentId, chat.studentId))
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
        .where(eq(chats.studentId, studentId))
        .catch((e) => {
            throw e as Error
        })

    return result[0] ?? null
}