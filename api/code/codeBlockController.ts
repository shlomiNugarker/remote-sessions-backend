import codeBlockService from './codeBlockService'
import { Request, Response } from 'express'

export default {
  getCodeBlock,
  getCodeBlocks,
}

async function getCodeBlocks(req: Request, res: Response) {
  try {
    const codeBlocks = await codeBlockService.query()
    res.send(codeBlocks)
  } catch (err) {
    console.log('Failed to get code blocks', err)
    res.status(500).send({ err: 'Failed to get code' })
  }
}
async function getCodeBlock(req: Request, res: Response) {
  try {
    const codeBlock = await codeBlockService.getById(req.params.id)
    res.send(codeBlock)
  } catch (err) {
    console.log('Failed to get code block', err)
    res.status(500).send({ err: 'Failed to get code block' })
  }
}
