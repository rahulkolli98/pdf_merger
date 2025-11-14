/**
 * Logger Utility
 * Provides consistent logging across the application with different log levels
 * Debug logs only appear in development environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log debug messages - only visible in development
   * Use for detailed debugging information
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log informational messages
   * Use for general application flow information
   */
  info(message: string, context?: LogContext): void {
    console.info(`[INFO] ${message}`, context || '');
  }

  /**
   * Log warning messages
   * Use for recoverable issues or deprecation warnings
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  /**
   * Log error messages
   * Use for errors and exceptions
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...context,
    });
  }

  /**
   * Create a namespaced logger for a specific module
   * Useful for tracking which component/module generated the log
   */
  namespace(name: string) {
    return {
      debug: (message: string, context?: LogContext) => 
        this.debug(`[${name}] ${message}`, context),
      info: (message: string, context?: LogContext) => 
        this.info(`[${name}] ${message}`, context),
      warn: (message: string, context?: LogContext) => 
        this.warn(`[${name}] ${message}`, context),
      error: (message: string, error?: Error | unknown, context?: LogContext) => 
        this.error(`[${name}] ${message}`, error, context),
    };
  }
}

export const logger = new Logger();
