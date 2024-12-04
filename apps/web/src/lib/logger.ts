interface LoggerOptions {
  level?: "debug" | "info" | "warn" | "error";
  isDevelopment?: boolean;
}

class ClientLogger {
  private isDevelopment: boolean;
  private level: string;

  constructor(options: LoggerOptions = {}) {
    this.isDevelopment =
      options.isDevelopment ?? process.env.NODE_ENV === "development";
    this.level = options.level ?? "info";
  }

  private formatMessage(level: string, message: string, meta?: object): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${meta ? " " + JSON.stringify(meta) : ""}`;
  }

  debug(message: string, meta?: object): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }

  info(message: string, meta?: object): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage("info", message, meta));
    }
  }

  warn(message: string, meta?: object): void {
    console.warn(this.formatMessage("warn", message, meta));
  }

  error(message: string, meta?: object): void {
    console.error(this.formatMessage("error", message, meta));

    // In production, you might want to send errors to your error tracking service
    if (!this.isDevelopment) {
      // Example: Send to error tracking service
      // await reportErrorToService(message, meta);
    }
  }
}

// Create a singleton instance
export const logger = new ClientLogger();
