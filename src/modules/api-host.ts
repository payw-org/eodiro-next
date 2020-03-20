/**
 * Pass --useProdApi to use stable production API version
 * published on the server
 *
 * Pass --useDevApi to use dev version of API
 * It requires local API server running
 *
 * Use these arguments only for the purpose of tests
 */

import { isClient } from './utils/is-client'
import { isDev } from './utils/is-dev'

export default class ApiHost {
  public static getHost(): string {
    // Forced to use production API
    // distributed on eodiro.com server
    if (
      process.env.npm_config_useProdApi ||
      (isClient() && document.documentElement.hasAttribute('data-use-prod-api'))
    ) {
      return 'https://api2.eodiro.com'
    }

    // Forced to use dev API
    if (
      process.env.npm_config_useDevApi ||
      (isClient() && document.documentElement.hasAttribute('data-use-dev-api'))
    ) {
      if (isClient()) {
        return `http://${location.hostname}:4020`
      } else {
        return 'http://localhost:4020'
      }
    }

    // Dev mode
    // Use local machine's IP address
    if (isDev() && isClient()) {
      return `http://${location.hostname}:4020`
    }

    // General, including server side call
    const host =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4020'
        : 'https://api2.eodiro.com'

    return host
  }
}
