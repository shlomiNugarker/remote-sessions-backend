import { IUser } from '../interfaces/IUser'
import { NextFunction, Request, RequestHandler, Response } from 'express'

import { sign, verify } from 'jsonwebtoken'

const createTokens = (user: any) => {
  const accessToken = sign(
    { username: user.userName, id: user._id },
    process.env.TOKEN_SECRET as string
  )

  return accessToken
}

declare global {
  namespace Express {
    interface Request {
      authenticated?: boolean
    }
  }
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const {
    headers: { cookie },
  } = req

  let cookies: { [key: string]: string } = {}

  const cookiesArray = req.headers.cookie?.split(';')
  cookiesArray?.forEach((cookie) => {
    const [key, value] = cookie.trim().split('=')
    cookies[key] = value
  })

  // get The "access-token" value:
  const accessToken = cookies['access-token']

  if (!accessToken)
    return res.status(400).json({ error: 'User not Authenticated!' })

  try {
    const validToken = verify(accessToken, process.env.TOKEN_SECRET as string)
    if (validToken) {
      req.authenticated = true
      return next()
    }
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

export const jwtService = {
  createTokens,
  validateToken,
}
