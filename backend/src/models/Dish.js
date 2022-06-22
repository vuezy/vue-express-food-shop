module.exports = (Schema, model) => {
  const DishSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      finishAt: Number
    }, 
    {
      timestamps: true
    }
  )
  
  const Dish = model('Dish', DishSchema)
  return Dish
}