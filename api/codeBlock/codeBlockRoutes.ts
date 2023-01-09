import express from 'express'
import codeBlockController from './codeBlockController'

const router = express.Router()

router.get('/', codeBlockController.getCodeBlocks)
router.get('/:id', codeBlockController.getCodeBlock)
router.put('/:id', codeBlockController.updateCodeBlock)
router.post('/', codeBlockController.addCodeBlock)

export default router
