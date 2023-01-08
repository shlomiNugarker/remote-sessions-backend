import express from 'express'

import codeController from './codeController'

const router = express.Router()

router.get('/:id', codeController.getCode)

export default router
