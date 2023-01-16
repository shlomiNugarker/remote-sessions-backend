import express from 'express'
import codeBlockController from './codeBlockController'
import { jwtService } from '../../services/jwtService'

const { getCodeBlocksIds, getCodeBlock, updateCodeBlock, addCodeBlock } =
  codeBlockController
const { validateToken } = jwtService

const router = express.Router()

router.get('/', getCodeBlocksIds)
router.get('/:id', validateToken, getCodeBlock)
router.put('/:id', validateToken, updateCodeBlock)
router.post('/', validateToken, addCodeBlock)

export default router
