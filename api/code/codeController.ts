import codeService from './codeService'
import { Request, Response } from 'express'

export default {
  getCode,
}

async function getCode(req: Request, res: Response) {
  try {
    const code = await codeService.getById(req.params.id)
    res.send(code)
  } catch (err) {
    console.log('Failed to get code', err)
    res.status(500).send({ err: 'Failed to get code' })
  }
}
