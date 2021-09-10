export const port = parseInt(process.env.PORT || "8587") || 8587;
export const snsTopicArn = process.env.SNS_TOPIC_ARN || error("SNS Topic ARN is missing");
export const nodeEnv = process.env.NODE_ENV || "unknown";
export const snsSubscriptionFilterAttribute = process.env.SNS_SUBSCRIPTION_FILTER_ATTR || "address";
export const useEC2InstanceProfile = (process.env.USE_EC2_INSTANCE_PROFILE || "false").toLowerCase() == "true";

function error(s:string): string {
    throw new Error(s);
}