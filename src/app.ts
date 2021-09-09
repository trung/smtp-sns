import {logger} from "./logger";
import {smtpServer} from "./smtp";
import {port} from "./config";

logger.info(`Starting SMTP server on port ${port}`);
smtpServer.listen(port);