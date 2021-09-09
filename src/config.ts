export const port = parseInt(process.env.PORT || "8587") || 8587;
export const snsTopicArn = process.env.SNS_TOPIC_ARN || error("SNS Topic ARN is missing");
export const nodeEnv = process.env.NODE_ENV || "unknown";
export const snsSubscriptionFilterAttribute = process.env.SNS_SUBSCRIPTION_FILTER_ATTR || "address";

function error(s:string): string {
    throw new Error(s);
}