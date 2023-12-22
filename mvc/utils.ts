import { PASSWORD_RESET_TEMPLATE } from "~/classes.server";
import nodemailer from "nodemailer";
import type { userEnum } from "~/types";
import { getCounselorsEmails } from "./auth/queries";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

export async function sendMail(mailDetails: any) {
    try {
        return await transporter.sendMail(mailDetails);
    } catch (e) {
        console.log(e);
        return e;
    }
}
export async function mailResetPasswordLink(email: string, token: string, origin: string, path: string, who: userEnum) {
    path = path.replace(/^\/|\/$/g, '');
    const link = `${origin}/${path}/${email}&${token}&${who}`

    const message = "Click the link below to reset your password\n\n" + link;
    const options = {
        to: email,
        subject: "Reset your password",
        text: message,
        html: PASSWORD_RESET_TEMPLATE(link)
    }

    console.log(message)

    return await sendMail(options)
}

const flaggedChatTemplate = (link: string) => `
<div style="background-color: #f5f5f5; padding: 20px; font-family: sans-serif; font-size: 16px; color: #000000;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <h1 style="color: #000000; font-size: 24px; font-weight: 600; margin-bottom: 20px;">Flagged chat</h1>
        <p style="margin-bottom: 20px;">Click the link below to view the flagged chat</p>
        <a href="${link}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">View chat</a>
    </div>
</div>
`

export async function mailFlaggedChat(chatId: number, origin: string, path: string) {
    path = path.replace(/^\/|\/$/g, '');
    const link = `${origin}/${path}/${chatId}`

    const counselors_emails = await getCounselorsEmails()

    if(!counselors_emails) return console.warn("No counselors emails found")
    
    counselors_emails.forEach(async email => {
        console.log(email)
        await sendMail({
            to: email.email,
            subject: "A chat was flagged",
            html: flaggedChatTemplate(link)
        })
    })
}