import ApiHost from '@/modules/api-host'
import eodiroAxios from '@/modules/eodiro-axios'
import EodiroHttpCookie from '@/modules/eodiro-http-cookie'
import dayjs from 'dayjs'
import { IncomingMessage, ServerResponse } from 'http'

export type TokensPack = {
  accessToken: string
  refreshToken: string
}

export class Tokens {
  static async get(req?: IncomingMessage): Promise<TokensPack> {
    const cookies = await EodiroHttpCookie.get(req)

    return {
      accessToken: cookies?.accessToken as string,
      refreshToken: cookies?.refreshToken as string,
    }
  }

  static async set(
    tokens: TokensPack,
    http?: {
      req: IncomingMessage
      res: ServerResponse
    }
  ): Promise<boolean> {
    const { accessToken, refreshToken } = tokens
    const succeeded = await EodiroHttpCookie.set(
      [
        {
          name: 'accessToken',
          value: accessToken,
          expires: dayjs()
            .add(1, 'd')
            .toDate()
            .toUTCString(),
        },
        {
          name: 'refreshToken',
          value: refreshToken,
          expires: dayjs()
            .add(13, 'd')
            .toDate()
            .toUTCString(),
        },
      ],
      http
    )
    if (!succeeded) {
      return false
    }

    return true
  }
}

export class AuthApi {
  static async isSigned(req?: IncomingMessage): Promise<boolean> {
    const [err, data] = await eodiroAxios<{
      isSignedIn: boolean
    }>(
      {
        url: ApiHost.getHost() + `/auth/is-signed-in`,
        method: 'POST',
      },
      {
        access: true,
        req,
      }
    )

    return err ? false : data.isSignedIn
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

  static async refresh(req?: IncomingMessage): Promise<false | TokensPack> {
    const [err, data] = await eodiroAxios<TokensPack>(
      {
        method: 'POST',
        url: ApiHost.getHost() + `/auth/refresh-token`,
      },
      {
        refresh: true,
        req,
      }
    )

    return err ? false : data
  }
}
