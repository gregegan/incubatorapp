import pino from 'pino';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';
const logDirectory = path.join(process.cwd(), 'logs');

const pinoConfig = {
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          ignore: 'pid,hostname',
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          customColors: 'error:red,warn:yellow,info:green,debug:blue,trace:gray',
          messageKey: 'message',
          minimumLevel: 'debug',
          sync: true,
          singleLine: false,
          colorizeObjects: true,
          errorLikeObjectKeys: ['err', 'error'],
        }
      }
    : {
        targets: [
          {
            target: 'pino/file',
            options: { destination: 1 },
            level: 'info'
          },
          {
            target: 'pino/file',
            options: { 
              destination: `${logDirectory}/error.log`,
              mkdir: true,
              sync: false
            },
            level: 'error'
          },
          {
            target: 'pino-roll',
            options: {
              file: `${logDirectory}/app.log`,
              size: '10m',
              interval: '1d',
              mkdir: true,
              sync: false
            }
          }
        ]
      },
  base: undefined,
  messageKey: 'message'
};

const pinoLogger = pino(pinoConfig);

interface LogMetadata {
  [key: string]: unknown;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private formatMetadata(metadata?: LogMetadata) {
    if (!metadata) return {};
    
    const { requestId, ...rest } = metadata;
    return {
      message: requestId ? `[${requestId}]` : '',
      data: Object.keys(rest).length > 0 ? rest : undefined
    };
  }

  trace(message: string, metadata?: LogMetadata) {
    if (this.isDevelopment) {
      const formatted = this.formatMetadata(metadata);
      pinoLogger.trace({ ...formatted.data }, `${formatted.message} ${message}`);
    }
  }

  debug(message: string, metadata?: LogMetadata) {
    if (this.isDevelopment) {
      const formatted = this.formatMetadata(metadata);
      pinoLogger.debug({ ...formatted.data }, `${formatted.message} ${message}`);
    }
  }

  info(message: string, metadata?: LogMetadata) {
    pinoLogger.info(this.formatMetadata(metadata), message);
  }

  warn(message: string, metadata?: LogMetadata) {
    pinoLogger.warn(this.formatMetadata(metadata), message);
  }

  error(message: string, metadata?: LogMetadata) {
    pinoLogger.error(this.formatMetadata(metadata), message);
  }
}

export const logger = new Logger(); 