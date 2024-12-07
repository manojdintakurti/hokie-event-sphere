const mongoose = require('mongoose');

const clickCountSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Ensure only one record per user
  categories: [
    {
      category: { type: String, required: true },
      categoryCount: { type: Number, default: 0 }, // Count for the category
      subCategories: [
        
        {
          subCategory: { type: String, required: true },
          subCategoryCount: { type: Number, default: 0 } // Count for each subcategory
        }
      ]
    }
  ]
});

// Ensure unique userId
clickCountSchema.index({ userId: 1 }, { unique: true });

const ClickCount = mongoose.model('ClickCount', clickCountSchema);

module.exports = ClickCount;