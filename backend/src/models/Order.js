module.exports = (Schema, model) => {
  const OrderSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      waitUntil: Number
    }, 
    {
      timestamps: true
    }
  )
  
  const Order = model('Order', OrderSchema)
  return Order
}