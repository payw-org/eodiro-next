const express = require('express')
const nodeCookie = require('cookie')

const cookieRouter = express.Router()

// Set cookie
cookieRouter.post('/cookie', async (req, res) => {
  /**
   * @type {import('../../modules/eodiro-http-cookie').Cookies}
   */
  const cookie = req.body

  let cookieString = `${cookie.name}=${cookie.value};Expires=${cookie.expires};HttpOnly;`

  if (req.socket.encrypted) {
    cookieString += 'Secure;'
  }

  res.setHeader('Set-Cookie', cookieString)

  res.sendStatus(200)
})

cookieRouter.get('/cookie', async (req, res) => {
  const cookies = req.headers?.cookie
    ? nodeCookie.parse(req.headers?.cookie)
    : {}

  res.json(cookies)
})

module.exports = cookieRouter
