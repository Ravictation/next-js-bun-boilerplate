import pino from 'pino'
import pino_http from 'pino-http'
import pretty from 'pino-pretty'
import { Request, Response } from 'express'

export const pinoLogg = () => {
  return pino_http({
    logger: pino(
      pretty({
        hideObject: true,
        messageFormat: (log, messageKey) => {
          const response = log as { req: { remoteAddress: string }; msg: string }
          const message = response.msg.split('address')

          return message[0] + response.req.remoteAddress + message[1]
        },
      }),
    ),

    customLogLevel: (req: Request, res: Response) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn'
      }

      if (res.statusCode >= 500) {
        return 'warn'
      }

      if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent'
      }

      return 'info'
    },

    // Define a custom success message
    customSuccessMessage: (req: Request, res: Response) => {
      if (res.statusCode === 404) {
        return `${res.statusCode} ${req.method} ${req.url} address resource not found`
      }

      return `${res.statusCode} ${req.method} ${req.url} address request completed`
    },

    // Define a custom error message
    customErrorMessage: (req: Request, res: Response, err: unknown) => `${res.statusCode} ${req.method} ${req.url} address request error`,
  })
}
