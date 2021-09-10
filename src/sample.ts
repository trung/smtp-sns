import {port} from "./config";
import {logger} from "./logger";
import {createTransport} from "nodemailer";

let transporter = createTransport({
    host: "localhost",
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

async function main() {
    const arbitraryMailOptions = {
        from: "no-reply@example.com", // sender address
        to: "foo@example.com", // list of receivers
        subject: "Arbitrary subject", // Subject line
        html: "<b>Hello world?</b>", // html body
    };
    let result = await transporter.sendMail(arbitraryMailOptions);

    logger.info(`Mail sent. ID: ${result.messageId}`);
}

main().catch(console.error);