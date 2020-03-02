export default class ApiHost {
  public static getHost(): string {
    const host =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4020'
        : 'https://api2.eodiro.com'

    return host
  }
}
