import Mongoose from 'mongoose'

const Schema = Mongoose.Schema

const UserTransctionSchema = new Schema(
  {
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    /**
     * transactionType : 'CREDIT' OR 'DEBIT'
     */
    transactionType: { type: String, required: true },
    previouseCredit: { type: Number, required: true },
    transactionValue: { type: Number, required: true },
    newCredit: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
)

export const UserTransction = Mongoose.model('UserTransctionSchema', UserTransctionSchema)
