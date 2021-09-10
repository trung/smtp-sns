# smtp-sns

A bridge which starts a simple SMTP server (no TLS) and relay plain text mails to AWS SNS

## Development

- Node 14.x

## Config

Support the following environment variables:

- `PORT`: SMTP server port
- `SNS_TOPIC_ARN`: AWS SNS Topic ARN to publish messages. If not defined, email messages are only visible in the log
- `SNS_SUBSCRIPTION_FILTER_ATTR`: attribute name being used to route messages to a target subscription
- `USE_EC2_INSTANCE_PROFILE`: true if using EC2 instance profile as credentials to publish to SNS

## Run

```bash
docker run --rm --init --name smtp-server -p 8587:8587 1run9/smtp-sns:latest
```