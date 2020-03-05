import ApiHost from '@/modules/api-host'
import eodiroAxios from '@/modules/eodiro-axios'
import EodiroHttpCookie from '@/modules/eodiro-http-cookie'
import nodeCookie from 'cookie'
import { IncomingMessage } from 'http'

export class Tokens {
  static async get(
    req?: IncomingMessage
  ): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const cookies =
      req && req.headers?.cookie
        ? nodeCookie.parse(req.headers?.cookie)
        : await EodiroHttpCookie.get()

    return {
      accessToken: cookies.accessToken as string,
      refreshToken: cookies.refreshToken as string,
    }
  }
}

export class AuthApi {
  static async isSigned() {
    const [err, data] = await eodiroAxios({
      url: ApiHost.getHost() + `/auth/is-signed-in`,
      method: 'POST',
    })
  }

  static async signIn(
    portalId: string,
    password: string
  ): Promise<
    | false
    | {
        accessToken: string
        refreshToken: string
      }
  > {
    const [err, data] = await eodiroAxios({
      method: 'POST',
      url: ApiHost.getHost() + `/auth/sign-in`,
      data: {
        portalId,
        password,
      },
    })

    return err ? false : data
  }
}
