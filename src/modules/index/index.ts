import { Router, Request, Response } from 'express'

export class ApiRoute {
  public static handle() {
    const router = Router().get('/about', async (req: Request, res: Response) => {
      return res.json('WELCOME TO API NMWSKINCARE')
    })

    return router
  }
}