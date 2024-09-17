
import express, { json, urlencoded, Request, Response } from 'express'
import helmet from 'helmet'
import next from 'next'
import { ApiRoute } from './modules/index'
import { Mongo } from './utils/database/mongo'
import { pinoLogg } from './utils/pino'
import { corsHandler } from './utils/cors'


const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  const mongo_connection = new Mongo

  mongo_connection.connect()

  server.use(helmet())
  server.use(corsHandler())
  server.set('trust proxy', 1)
  server.use(
    json({
      type: ['application/json', 'application/csp-report', 'application/report+json']
    })
  )
  server.use(urlencoded({ extended: false }))
  server.use('/api', pinoLogg(), ApiRoute.handle())
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res)
  })

  server.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
  })
})
