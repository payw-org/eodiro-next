/**
 * Pass --useProdApi to use stable production API version
 * published on the server
 */

export default class ApiHost {
  public static getHost(): string {
    if (
      process.env.npm_config_useProdApi ||
      (typeof window !== 'undefined' &&
        document.documentElement.hasAttribute('data-use-prod-api'))
    ) {
      return 'https://api2.eodiro.com'
    }

    const host =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4020'
        : 'https://api2.eodiro.com'

    return host
  }
}
