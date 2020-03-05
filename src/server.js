const bodyParser = require('body-parser')
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV === 'development'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(dev ? 3020 : 3000, (err) => {
    if (err) {
      throw err
    }

    console.log('> Listening on port 3020')
  })
})
