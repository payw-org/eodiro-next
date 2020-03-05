/**
 * eodiro-axios.ts
 * A simple axios async wrapper
 * (c) 2019-2020 Jang Haemin
 * @license MIT
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export default function eodiroAxios(
  config: AxiosRequestConfig,
  eodiroAxiosConfig?: {
    requireAuth?: boolean
  }
): Promise<[any, AxiosResponse, number]> {
  return new Promise((resolve) => {
    if (eodiroAxiosConfig && typeof eodiroAxiosConfig !== 'object') {
      console.error('eodiroAxios - Wrong type of parameter eodiroAxiosConfig')
      resolve([true, null, null])
      return
    }

    // if (eodiroAxiosConfig) {
    //   const { requireAuth, http } = eodiroAxiosConfig

    //   if (requireAuth) {
    //     const accessToken = Auth.getAccessToken(http)
    //     const refreshToken = Auth.getRefreshToken(http)

    //     // If there is no access token avilable,
    //     // terminate api request and resolve with an error
    //     if (!accessToken) {
    //       resolve([true, null])
    //       return
    //     } else {
    //       // Append headers data
    //       config.headers = {
    //         accesstoken: accessToken,
    //         refreshtoken: refreshToken,
    //       }
    //     }
    //   }
    // }

    axios(config)
      .then((res) => {
        resolve([null, res.data, res.status])
      })
      .catch((err) => {
        if (err) {
          console.error(err)
        }

        // Network error
        // Perhaps our server is closed
        if (!err.response) {
          console.error('[eodiro-axios] network error')
          resolve([err, null, null])
          return
        }

        resolve([err, null, err.response.status])
      })
  })
}
