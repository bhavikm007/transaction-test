import { responseHandler } from '../../config/ResponseHandler.js'
import { errorHandle } from '../../config/ErrorHandler.js'
import { UserTransction } from '../models/UsersTransactions.js'

/**
 * 
 * @param {number} userId 
 * @returns {JSON response}
 */
export const getUserTransaction = async (request, response) => {
  try {
    let userId = request.params.userId;
    let userTransction = await UserTransction.find({ userId: userId })
    if (userTransction) {
      return response.send(responseHandler(userTransction))
    } else {
      return response.send(errorHandle(undefined, { message: 'Error while get user transaction.' }))
    }
  } catch (error) {
    // console.trace()
    return response.send(errorHandle(undefined, { message: 'Error while get user transaction.' }))
  }
}

/**
 * 
 * @param {number} userId 
 * @body {JSON} transaction data
 * @returns {JSON response}
 */
export const createUserTransction = async (request, response) => {
  try {
    let userId = request.params.userId;
    let name = request.body.name;
    let transactionType = request.body.type;
    let transactionValue = request.body.value;
    let newTransactionValue;

    let userLastTransction = await UserTransction.findOne({
      userId: userId
    })
      .sort({ _id: -1 })

    let userLastTransactionValue = (userLastTransction && userLastTransction.newCredit) ? userLastTransction.newCredit : 0;

    if (transactionType === 'CREDIT') {
      newTransactionValue = userLastTransactionValue + transactionValue
    } else if (transactionType === 'DEBIT') {
      if (userLastTransactionValue - transactionValue < 0) {
        return response.send(errorHandle(undefined, { message: 'Debit amount can not be greater than current balance.' }))
      }
      newTransactionValue = userLastTransactionValue - transactionValue
    } else {
      return response.send(errorHandle(undefined, { message: 'Please select proper transaction type.' }))
    }

    let newTransactionObject = {
      userId,
      name,
      transactionType,
      previouseCredit: userLastTransactionValue,
      transactionValue,
      newCredit: newTransactionValue
    }

    const newUserTransction = new UserTransction(newTransactionObject)
    newUserTransction.save()

    if (!newUserTransction) {
      throw newUserTransction
    }

    return response.send(responseHandler({ message: 'Transaction completed successfully.' }))
  } catch (error) {
    // console.trace()
    return response.send(errorHandle(undefined, { message: 'Error while transaction.' }))
  }
}

/**
 * 
 * @param {number} userId 
 * @returns {JSON response}
 */
export const getUserCredit = async (request, response) => {
  try {
    let userId = request.params.userId;
    let userTransction = await UserTransction.findOne({ userId: userId }).sort({ _id: -1 })
    
    if (userTransction) {
      return response.send(responseHandler({ availableCredit: userTransction.newCredit }))
    } else {
      return response.send(errorHandle(undefined, { message: 'Error while get user credit.' }))
    }

  } catch (error) {
    // console.trace()
    return response.send(errorHandle(undefined, { message: 'Error while get user credit.' }))
  }
}