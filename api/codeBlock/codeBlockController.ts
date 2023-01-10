import codeBlockService from './codeBlockService'
import { Request, Response } from 'express'

export default {
  getCodeBlock,
  getCodeBlocksIds,
  updateCodeBlock,
  addCodeBlock,
}

async function getCodeBlocksIds(req: Request, res: Response) {
  try {
    const codeBlocks = await codeBlockService.queryIds()
    res.send(codeBlocks)
  } catch (err) {
    // console.log('Failed to get code blocks', err)
    res.status(500).send({ err: 'Failed to get code' })
  }
}
async function getCodeBlock(req: Request, res: Response) {
  try {
    const codeBlock = await codeBlockService.getById(req.params.id)
    res.send(codeBlock)
  } catch (err) {
    // console.log('Failed to get code block', err)
    res.status(500).send({ err: 'Failed to get code block' })
  }
}

async function updateCodeBlock(req: Request, res: Response) {
  try {
    const codeBlock = req.body
    const updatedCodeBlock = await codeBlockService.update(codeBlock)
    res.json(updatedCodeBlock)
  } catch (err) {
    // console.log('Failed to update code block', err)
    res.status(500).send({ err: 'Failed to update codeBlock' })
  }
}

async function addCodeBlock(req: Request, res: Response) {
  try {
    const codeBlock = req.body
    const addedCodeBlock = await codeBlockService.add(codeBlock)
    res.json(addedCodeBlock)
  } catch (err) {
    // console.log('Failed to add code block', err)
    res.status(500).send({ err: 'Failed to add codeBlock' })
  }
}
