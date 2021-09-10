export const port = parseInt(process.env.PORT || "8587") || 8587;
export const snsTopicArn = process.env.SNS_TOPIC_ARN;
export const snsSubscriptionFilterAttribute = process.env.SNS_SUBSCRIPTION_FILTER_ATTR || "address";
export const useEC2InstanceProfile = (process.env.USE_EC2_INSTANCE_PROFILE || "false").toLowerCase() == "true";