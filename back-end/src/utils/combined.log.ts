import fs from "fs";
import { createLogger, format, transports } from "winston";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Logs folder at project root
const logDir = join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Winston logger
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    new transports.File({ filename: join(logDir, "app.log"), level: "info" }),
    new transports.File({ filename: join(logDir, "error.log"), level: "error" }),
    new transports.Console({ format: format.simple() }),
  ],
});

export default logger;