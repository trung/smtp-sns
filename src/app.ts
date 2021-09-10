import {logger} from "./logger";
import {registerCallback, smtpServer} from "./smtp";
import {port, snsTopicArn} from "./config";
import {publishToSNS} from "./sns";

if (snsTopicArn) {
    logger.info(`Target SNS Topic: ${snsTopicArn}`)
    registerCallback((mail, session) => {
        publishToSNS(mail).then((data) => {
            logger.info(`Published mail message ${mail.messageId} to SNS. SNS Message ID is ${data.MessageId}`);
        }).catch((err) => {
            logger.error(`Unable to publish to SNS: ${err}`)
        });
    });
}

logger.info(`Starting SMTP server on port ${port}`);
smtpServer.listen(port);