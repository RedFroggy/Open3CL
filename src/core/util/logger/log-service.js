/**
 * Log service
 * Override standard console with log level configuration
 *
 * Define LOG_LEVEL with maximum level you want to log into console
 * possible values are : debug, trace, info, warn, error
 */
export class Log {
  /**
   * @type {string[]}
   */
  static levelOrder = ['debug', 'info', 'warn', 'error'];

  /**
   * @param message {string} Log message
   * @param detail {any|undefined} Log detail
   */
  static debug(message, detail = undefined) {
    if (Log.isLogged('debug')) {
      console.debug(`[DEBUG] ${message}`, detail);
    }
  }

  /**
   * @param message {string} Log message
   * @param detail {any|undefined} Log detail
   */
  static log(message, detail = undefined) {
    if (Log.isLogged('debug')) {
      Log.debug(message, detail);
    }
  }

  /**
   * @param message {string} Log message
   * @param detail {any|undefined} Log detail
   */
  static info(message, detail = undefined) {
    if (Log.isLogged('info')) {
      console.info(`[INFO] ${message}`, detail);
    }
  }

  /**
   * @param message {string} Log message
   * @param detail {any|undefined} Log detail
   */
  static warn(message, detail = undefined) {
    if (Log.isLogged('warn')) {
      console.warn(`[WARN] ${message}`, detail);
    }
  }

  /**
   * @param message {string} Log message
   * @param detail {any|undefined} Log detail
   */
  static error(message, detail = undefined) {
    if (Log.isLogged('error')) {
      console.error(`[ERROR] ${message}`, detail);
    }
  }

  /**
   * @param level {string} Log level
   * @return true if this level should be logged
   */
  static isLogged(level) {
    return Log.levelOrder.indexOf(level) || 0 >= Log.levelOrder.indexOf(process.env.LOG_LEVEL) || 0;
  }
}
