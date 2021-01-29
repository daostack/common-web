import { LogSeverity, write } from 'firebase-functions/lib/logger';

export type logSeverity = 'debug' | 'info' | 'notice' | 'warn' | 'error'| 'critical';
export type severityLogger = (message: string, context?: Record<string, any>, ...args: any) => void;

export type ILogger = {
  [key in logSeverity]: severityLogger;
};

const createLog = (severity: LogSeverity, message: any, context?: any, args?: any) => {
  write({
    severity,
    message,
    context: {
      ...(context || {}),
      args
    }
  });
};

global.logger = {
  debug: (message, context, args) => {
    createLog('DEBUG', message, context, args);
  },

  info: (message, context, args) => {
    createLog('INFO', message, context, args);
  },

  notice: (message, context, args) => {
    createLog('NOTICE', message, context, args);
  },

  warn: (message, context, args) => {
    createLog('WARNING', message, context, args);
  },

  error: (message, context, args) => {
    createLog('ERROR', message, context, args);
  },

  critical: (message, context, args) => {
    createLog('CRITICAL', message, context, args);
  },
};