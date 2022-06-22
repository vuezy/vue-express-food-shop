module.exports = (Schema, model) => {
  const IngredientSchema = new Schema(
    {
      name: String,
      imageName: String,
      price: Number
    }, 
    {
      timestamps: true
    }
  )
  
  const Ingredient = model('Ingredient', IngredientSchema)
  return Ingredient
}