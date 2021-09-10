import {AWSError, config, EC2MetadataCredentials, SNS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import {ParsedMail} from "mailparser";
import {snsSubscriptionFilterAttribute, snsTopicArn, useEC2InstanceProfile} from "./config";
import {logger} from "./logger";

if (useEC2InstanceProfile) {
    config.credentials = new EC2MetadataCredentials({
        httpOptions: { timeout: 5000 }, // 5 second timeout
        maxRetries: 10, // retry 10 times
    });
}

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