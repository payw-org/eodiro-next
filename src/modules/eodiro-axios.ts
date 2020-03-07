/**
 * eodiro-axios.ts
 * A simple axios async wrapper
 * (c) 2019-2020 Jang Haemin
 * @license MIT
 */

import { Tokens } from '@/api'
import axios, { AxiosRequestConfig } from 'axios'
import { IncomingMessage } from 'http'

const moduleConsoleTag = '[eodiro-axios]'

export default async function eodiroAxios<T = any>(
  config: AxiosRequestConfig,
  eodiroAxiosConfig?: {
    access?: boolean
    refresh?: boolean
    req?: IncomingMessage
    accessIfExist?: boolean
  }
): Promise<[any, T, number]> {
  if (eodiroAxiosConfig && typeof eodiroAxiosConfig !== 'object') {
    console.error(
      `${moduleConsoleTag} Wrong type of parameter eodiroAxiosConfig`
    )

    return [true, null, null]
  }

  if (eodiroAxiosConfig) {
    const {
      access = false,
      refresh = false,
      req,
      accessIfExist = false,
    } = eodiroAxiosConfig

    if (access || refresh || accessIfExist) {
      if (!req) {
        console.error(
          `${moduleConsoleTag} you are using auth without passing req argument, it may not work on server-side`
        )
      }

      const cookies = await Tokens.get(req)
      const { accessToken, refreshToken } = cookies

      if (!config.headers) {
        config.headers = {}
      }

      if (access && !accessToken) {
        return [true, null, 401]
      } else {
        config.headers.accessToken = accessToken
      }

      if (accessIfExist && accessToken != null) {
        config.headers.accessToken = accessToken
      }

      if (refresh && !refreshToken) {
        return [true, null, 401]
      } else {
        config.headers.refreshToken = refreshToken
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
