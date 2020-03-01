export default class ApiHost {
  private static HOST = null

  public static setHost(host: string): void {
    if (host.startsWith('eodiro')) {
      // eodiro.com
      host = 'https://api2.eodiro.com'
    } else if (host.startsWith('dev')) {
      // dev.eodiro.com
      host = 'https://dev.api2.eodiro.com'
    } else {
      // Dev
      host = 'http://' + host.split(':')[0] + ':4020'
    }

    this.HOST = host
  }

  public static getHost(): string {
    const host = this.HOST
      ? this.HOST
      : process.env.NODE_ENV === 'development'
      ? 'http://localhost:4020'
      : 'https://api2.eodiro.com'

    return host
  }
}
