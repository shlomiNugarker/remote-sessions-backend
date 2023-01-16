import { WithId, Document } from 'mongodb'
import authService from './authService'
import { Request, RequestHandler, Response } from 'express'

import { jwtService } from '../../services/jwtService'

export default { login, signup, logout }

declare module 'express-session' {
  interface SessionData {
    user: any
  }
}

async function login(req: Request, res: Response) {
  const { userName, password } = req.body
  try {
    const user = await authService.login(userName, password)
    req.session.user = user

    // jwt:
    const accessToken = jwtService.createTokens(user)
    res.cookie('access-token', accessToken, {
      maxAge: 60 * 1000 * 60 * 24, // 24H  //mil
      httpOnly: true,
    })

    res.json(user)
  } catch (err) {
    console.log('Failed to Login ' + err)
    res.status(401).send({ err: 'Failed to Login' })
  }
}

async function signup(req: Request, res: Response) {
  try {
    const { userName, password, fullName, isMentor } = req.body
    const account = await authService.signup(
      userName,
      password,
      fullName,
      isMentor
    )
    const user = await authService.login(userName, password)
    req.session.user = user
    res.json(user)
  } catch (err) {
    console.log('Failed to signup ' + err)
    res.status(500).send({ err: 'Failed to signup' })
  }
}

async function logout(req: Request, res: Response) {
  try {
    req.session.destroy((err) => console.log()) // ?
    res.clearCookie('access-token')
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' })
  }
}
