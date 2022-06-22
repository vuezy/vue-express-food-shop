module.exports = (Schema, model) => {
  const RecipeSchema = new Schema(
    {
      name: String,
      imageName: String,
      price: Number,
      point: Number,
      totalTimeTaken: Number,
      ingredients: Schema.Types.Mixed
    },
    {
      timestamps: true
    }
  )

  const Recipe = model('Recipe', RecipeSchema)
  return Recipe
}