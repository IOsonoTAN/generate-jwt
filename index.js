require('dotenv').config()
const Koa = require('koa')
const Router = require('koa-router')

const port = process.env.PORT || 3000
const app = new Koa()
const router = new Router()
const jwt = require('jsonwebtoken')
const moment = require('moment')

const timeStamp = new Date().getTime()
const algorithm = process.env.ALGORITHM
const channelId = process.env.CHANNEL_ID
const clientId = process.env.CLIENT_ID
const secret = process.env.SECRET

const payload = {
  timeStamp,
  clientId,
  channelId
}

const generateToken = () => jwt.sign(payload, secret, {
  algorithm
})

const verifyToken = (token) => jwt.verify(token, secret)

router.get('/', async(ctx) => {
  ctx.body = {
    generateLink: `${ctx.request.origin}/generate`,
    verifyLink: `${ctx.request.origin}/verify?token={JWT_TOKEN}`
  }
})

router.get('/generate', async(ctx) => {
  try {
    const token = generateToken()

    ctx.body = {
      Authorization: `Bearer ${token}`,
      verifyLink: `${ctx.request.origin}/verify?token=${token}`,
      payload
    }
  } catch (e) {
    ctx.throw(400, e.message)
  }
})

router.get('/verify', async(ctx) => {
  try {
    const {
      token
    } = ctx.request.query

    ctx.body = verifyToken(token)
  } catch (e) {
    ctx.throw(400, e.message)
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
  console.log(`application is listening on port ${port}`)
})