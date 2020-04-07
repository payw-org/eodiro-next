import { AuthApi, Tokens } from '@/api'
import { IncomingMessage, ServerResponse } from 'http'
import ApiHost from '../api-host'
import eodiroAxios from '../eodiro-axios'

type AuthState = {
  isSigned: boolean
  isAdmin: boolean
  userId: number
}

/**
 * Return auth information using AuthApi internally.
 * Also automatically refresh the tokens if needed.
 */
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
    userId: null,
  }

  // Verify token
  if (tokens.accessToken) {
    const authCheck = await AuthApi.isSigned(req)

    if (authCheck.isSigned) {
      // Token is signed and available to be used with
      authState.isSigned = authCheck.isSigned
      authState.isAdmin = authCheck.isAdmin
      authState.userId = authCheck.userId
    } else {
      // The access token has been expired and
      // needs to be refresehd with the refresh token
      const newTokens = await AuthApi.refresh(req)

      if (newTokens) {
        const [err, authCheck] = await eodiroAxios({
          method: 'POST',
          url: ApiHost.getHost() + `/auth/is-signed-in`,
          headers: {
            accessToken: newTokens.accessToken,
          },
        })

        if (!err) {
          await Tokens.set(newTokens, { req, res })
          authState.isSigned = authCheck.isSigned
          authState.isAdmin = authCheck.isAdmin
          authState.userId = authCheck.userId
        }
      }
    }
  } else if (tokens.refreshToken) {
    // Access token has expired and refresh token is available
    const newTokens = await AuthApi.refresh(req)

    if (newTokens) {
      const [err, authCheck] = await eodiroAxios({
        method: 'POST',
        url: ApiHost.getHost() + `/auth/is-signed-in`,
        headers: {
          accessToken: newTokens.accessToken,
        },
      })

      if (!err) {
        await Tokens.set(newTokens, { req, res })
        authState.isSigned = authCheck.isSigned
        authState.isAdmin = authCheck.isAdmin
        authState.userId = authCheck.userId
      }
    }
  }

  return authState
}
