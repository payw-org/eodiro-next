const express = require('express')

const cookieRouter = express.Router()

// Set cookie
cookieRouter.post('/cookie', async (req, res) => {
  /**
   * @type {import('../../modules/eodiro-http-cookie').Cookies}
   */
  const cookies = req.body

  if (!Array.isArray(cookies)) {
    res.sendStatus(422)
    return
  }

  cookies.forEach((cookie) => {
    let cookieString = `${cookie.name}=${cookie.value};Expires=${cookie.expires};HttpOnly;`

    if (req.socket.encrypted) {
      cookieString += 'Secure;'
    }

    res.setHeader('Set-Cookie', cookieString)
  })

  res.sendStatus(200)
})

module.exports = cookieRouter
