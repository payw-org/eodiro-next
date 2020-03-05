/**
 * eodiro-axios.ts
 * A simple axios async wrapper
 * (c) 2019-2020 Jang Haemin
 * @license MIT
 */

import axios, { AxiosRequestConfig } from 'axios'
import EodiroHttpCookie from './eodiro-http-cookie'

const moduleConsoleTag = '[eodiro-axios]'

export default async function eodiroAxios(
  config: AxiosRequestConfig,
  eodiroAxiosConfig?: {
    requireAuth?: boolean
  }
): Promise<[any, any, number]> {
  if (eodiroAxiosConfig && typeof eodiroAxiosConfig !== 'object') {
    console.error('eodiroAxios - Wrong type of parameter eodiroAxiosConfig')

    return [true, null, null]
  }

  if (eodiroAxiosConfig) {
    const { requireAuth } = eodiroAxiosConfig

    if (requireAuth) {
      const cookie = await EodiroHttpCookie.get()
      const { accessToken, refreshToken } = cookie

      if (!accessToken) {
        return [true, null, 401]
      } else {
        config.headers = {
          accessToken,
          refreshToken,
        }
      }
    }
  }

  try {
    const res = await axios(config)
    return [null, res.data, res.status]
  } catch (err) {
    console.warn(moduleConsoleTag, err)

    // Network error
    // Perhaps our server is closed
    if (!err.response) {
      console.error(`${moduleConsoleTag} network error`)
      return [err, null, null]
    }

    return [err, null, err.response.status]
  }
}
