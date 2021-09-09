import {AWSError, SNS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import {ParsedMail} from "mailparser";
import {snsSubscriptionFilterAttribute, snsTopicArn} from "./config";
import {logger} from "./logger";

const snsPublisher = new SNS();

export async function publishToSNS(mail: ParsedMail): Promise<PromiseResult<SNS.PublishResponse, AWSError>> {
    const to = Array.isArray(mail.to) ? mail.to[0]?.text : mail.to?.text;
    logger.info(`Publishing ${mail.messageId} to ${snsTopicArn} with attribute ${snsSubscriptionFilterAttribute}=${to}`);
    return snsPublisher.publish({
        Subject: mail.subject || "unknown",
        Message: mail.html || mail.text || "unknown",
        TopicArn: snsTopicArn,
        MessageAttributes: {
            snsSubscriptionFilterAttribute: {
                DataType: "String",
                StringValue: to,
            }
        },
    }).promise();
}