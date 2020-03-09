import ApiHost from '@/modules/api-host'
import eodiroAxios from '@/modules/eodiro-axios'
import { IncomingMessage } from 'http'
import { TokensPack } from './tokens'

export class AuthApi {
  static async isSigned(
    req?: IncomingMessage
  ): Promise<{
    isSigned: boolean
    isAdmin?: boolean
    userId?: number
  }> {
    const [err, data] = await eodiroAxios<{
      isSigned: boolean
      isAdmin?: boolean
      userId?: number
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

    return err
      ? {
          isSigned: false,
        }
      : data
  }

  static async signIn(
    portalId: string,
    password: string
  ): Promise<false | TokensPack> {
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

  static async signUp(
    portalId: string,
    nickname: string,
    password: string
  ): Promise<
    | {
        portalId: boolean
        nickname: boolean
        password: boolean
      }
    | false
  > {
    portalId = portalId.toLowerCase().trim()
    if (!portalId.includes('@')) {
      portalId += '@cau.ac.kr'
    }
    nickname = nickname.trim().replace(' ', '')

    if (
      portalId.length === 0 ||
      nickname.length === 0 ||
      password.length === 0
    ) {
      return {
        portalId: false,
        nickname: false,
        password: false,
      }
    }

    const [err, data] = await eodiroAxios<{
      portalId: boolean
      nickname: boolean
      password: boolean
    }>({
      method: 'POST',
      url: ApiHost.getHost() + `/auth/sign-up`,
      data: {
        portalId,
        nickname,
        password,
      },
    })

    return err ? false : data
  }

  // TODO: move to Tokens class
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

  /**
   * Pass with/without email host
   * @param portalId
   */
  static async validatePortalId(portalId: string): Promise<boolean> {
    if (!portalId.includes('@')) {
      portalId = portalId + '@cau.ac.kr'
    }

    const [err, data] = await eodiroAxios<boolean>({
      method: 'POST',
      url: ApiHost.getHost() + `/auth/validate/portal-id`,
      data: {
        portalId,
      },
    })

    return err ? false : data
  }

  static async validateNickname(nickname: string): Promise<boolean> {
    const [err, data] = await eodiroAxios<boolean>({
      method: 'POST',
      url: ApiHost.getHost() + `/auth/validate/nickname`,
      data: {
        nickname,
      },
    })

    return err ? false : data
  }

  static async validatePassword(password: string): Promise<boolean> {
    const [err, data] = await eodiroAxios<boolean>({
      method: 'POST',
      url: ApiHost.getHost() + `/auth/validate/password`,
      data: {
        password,
      },
    })

    return err ? false : data
  }
}
