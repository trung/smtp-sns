import {
    SMTPServer,
    SMTPServerAddress,
    SMTPServerAuthentication,
    SMTPServerAuthenticationResponse, SMTPServerDataStream,
    SMTPServerSession
} from "smtp-server";
import {ParsedMail, simpleParser} from "mailparser";
import {logger} from "./logger";

export const smtpServer = new SMTPServer({
    secure: false,
    onConnect(session: SMTPServerSession, callback: (err?: (Error | null)) => void) {
        logger.info(`${session.clientHostname} connected`);
        return callback();
    },
    onAuth(auth: SMTPServerAuthentication, session: SMTPServerSession, callback: (err: (Error | null | undefined), response?: SMTPServerAuthenticationResponse) => void) {
        // accept all users
        callback(null, { user: 123});
    },
    onMailFrom(address: SMTPServerAddress, session: SMTPServerSession, callback: (err?: (Error | null)) => void) {
        // accept all FROM addresses
        return callback();
    },
    onRcptTo(address: SMTPServerAddress, session: SMTPServerSession, callback: (err?: (Error | null)) => void) {
        // accept all TO addresses
        return callback();
    },
    onData(stream: SMTPServerDataStream, session: SMTPServerSession, callback: (err?: (Error | null)) => void) {
        simpleParser(stream)
            .then(mail => {
                logger.info(`${mail.messageId}:    From: ${mail.from?.text}`);
                logger.info(`${mail.messageId}:      To: ${Array.isArray(mail.to) ? mail.to[0]?.text : mail.to?.text}`);
                logger.info(`${mail.messageId}: Subject: ${mail.subject}`);
                logger.info(`${mail.messageId}:    Body: ${mail.html || mail.text}`);
                onMail(mail, session);
            })
            .catch(err => {
                logger.error(`Parsing error: ${err}`);
                onError(err);
            });
        stream.on("end", callback);
    },
    onClose(session: SMTPServerSession, callback: (err?: (Error | null)) => void) {
        logger.info(`${session.clientHostname} closed`);
    }
});

smtpServer.on("error", err => {
    logger.error(`Error ${err}`);
});

export type OnMailFunc = (mail: ParsedMail, session: SMTPServerSession) => void;
export type OnErrorFunc = (err: Error) => void;


let onMail: OnMailFunc = (mail, session) => {
    // do nothing
}

let onError: OnErrorFunc = (err) => {
    // do nothing
}

export const registerCallback = (onMailCallback: OnMailFunc, onErrorCallback?: OnErrorFunc) => {
    onMail = onMailCallback;
    if (onErrorCallback) {
        onError = onErrorCallback;
    }
}