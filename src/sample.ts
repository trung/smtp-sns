import {port} from "./config";
import {logger} from "./logger";
import {createTransport} from "nodemailer";

async function main() {
    const transporter = createTransport({
        host: process.env.SERVER || "localhost",
        port: port,
        secure: false,
        requireTLS: false,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: "abc",
            pass: "foo",
        }
    });
    const arbitraryMailOptions = {
        from: "no-reply@example.com", // sender address
        to: process.env.TO || "foo@example.com", // list of receivers
        subject: "Arbitrary subject", // Subject line
        html: "<b>Hello world?</b>", // html body
    };
    const result = await transporter.sendMail(arbitraryMailOptions);

    logger.info(`Mail sent. ID: ${result.messageId}`);
}

main().catch(console.error);