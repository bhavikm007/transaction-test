import express from 'express'
const router = express.Router()

import {
    getUserTransaction,
    createUserTransction,
    getUserCredit
} from '../api/controllers/UserTransactionController.js'

router.get('/get-user-transaction/:userId', getUserTransaction)
router.post('/create-user-transaction/:userId', createUserTransction)
router.get('/get-user-credit/:userId', getUserCredit)

export default router