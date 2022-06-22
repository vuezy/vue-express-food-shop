module.exports = (Schema, model) => {
  const InventorySchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      items: [{
        name: String,
        imageName: String,
        itemType: String,
        quantity: Number
      }]
    }, 
    {
      timestamps: true
    }
  )
  
  const Inventory = model('Inventory', InventorySchema)
  return Inventory
}