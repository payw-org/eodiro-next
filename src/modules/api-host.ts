/**
 * Pass --useProdApi to use stable production API version
 * published on the server
 */

if (process.env.npm_config_useprodapi) {
  console.log('[ApiHost] using production API')
}

export default class ApiHost {
  public static getHost(): string {
    if (process.env.npm_config_useprodapi) {
      return 'https://api2.eodiro.com'
    }

    const host =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4020'
        : 'https://api2.eodiro.com'

    return host
  }
}
