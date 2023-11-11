import {PASSWORD_RESET_TEMPLATE} from "~/classes.server";
import nodemailer from "nodemailer";

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
export async function mailResetPasswordLink(email: string, token: string, origin: string, path:string) {
    path = path.replace(/^\/|\/$/g, '');
    const link = `${origin}/${path}/${email}&${token}`;

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