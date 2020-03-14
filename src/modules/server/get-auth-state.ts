import { AuthApi, Tokens } from '@/api'
import dayjs from 'dayjs'
import { IncomingMessage, ServerResponse } from 'http'
import EodiroHttpCookie from '../eodiro-http-cookie'

type AuthState = {
  isSigned: boolean
  isAdmin: boolean
}

export async function getAuthState(
  ctx: {
    req: IncomingMessage
    res: ServerResponse
  } = { req: undefined, res: undefined }
): Promise<AuthState> {
  const { req, res } = ctx
  const tokens = await Tokens.get(req)
  const authState: AuthState = {
    isSigned: false,
    isAdmin: false,
  }

  // Verify token
  if (tokens.accessToken) {
    const authCheck = await AuthApi.isSigned(req)
    delete authCheck.userId

    if (authCheck.isSigned) {
      authState.isSigned = authCheck.isSigned
      authState.isAdmin = authCheck.isAdmin
    } else {
      const newTokens = await AuthApi.refresh(req)

      if (newTokens) {
        await Tokens.set(newTokens, { req, res })
        const authCheck = await AuthApi.isSigned(req)
        authState.isSigned = authCheck.isSigned
        authState.isAdmin = authCheck.isAdmin
      } else {
        // Clear tokens
        await EodiroHttpCookie.set(
          [
            {
              expires: dayjs('1970-01-01')
                .toDate()
                .toUTCString(),
              name: 'accessToken',
              value: '',
            },
            {
              expires: dayjs('1970-01-01')
                .toDate()
                .toUTCString(),
              name: 'refreshToken',
              value: '',
            },
          ],
          {
            req,
            res,
          }
        )
      }
    }
  }

  return authState
}
