import {createTransport} from "nodemailer";
import {registerCallback, smtpServer} from "../smtp";
import {Mutex} from "async-mutex";
import {logger} from "../logger";

let port: number | undefined;

beforeAll(async () => {
    smtpServer.listen();
    let address = smtpServer.server.address();
    if (typeof address == "string") {
        port = parseInt(address);
    } else {
        port = address?.port;
    }
    logger.info(`Server started at port ${port}`);
});

afterAll(() => {
   smtpServer.close();
});

test("SMTP receives mail successfully", async () => {
    const mutex = new Mutex();

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
    const arbitraryMailOptions = {
        from: "no-reply@example.com", // sender address
        to: "foo@example.com", // list of receivers
        subject: "Arbitrary subject", // Subject line
        html: "<b>Hello world?</b>", // html body
    };
    let actualMail: any;
    mutex.acquire().then((release) => {
        registerCallback((mail, session) => {
            actualMail = mail;
            release();
        }, (err) => {
            release();
        });
    });

    let info = await transporter.sendMail(arbitraryMailOptions);

    await mutex.waitForUnlock();

    expect(info).not.toBeUndefined();
    expect(actualMail.from?.text).toEqual(arbitraryMailOptions.from);
    const to = Array.isArray(actualMail.to) ? actualMail.to[0]?.text : actualMail.to?.text;
    expect(to).toEqual(arbitraryMailOptions.to);
    expect(actualMail.subject).toEqual(arbitraryMailOptions.subject);
    expect(actualMail.html.trim()).toEqual(arbitraryMailOptions.html.trim());
});

