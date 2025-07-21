import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema({
  name: {
    Type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})


const Product = mongoose.model('Product', productSchema)

export default Product