import ApiHost from '@/modules/api-host'
import eodiroAxios from '@/modules/eodiro-axios'
import EodiroHttpCookie from '@/modules/eodiro-http-cookie'

export class Tokens {
  static async get(): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const cookies = await EodiroHttpCookie.get()

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
