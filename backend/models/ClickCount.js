const mongoose = require('mongoose');

const clickCountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  categoryCount: { type: Number, default: 0 }, // Count for the main category
  subCategories: [
    {
      subCategory: { type: String, required: true },
      subCategoryCount: { type: Number, default: 0 } // Count for each subcategory
    }
  ]
});

// Ensure unique combination of userId and category
clickCountSchema.index({ userId: 1, category: 1 }, { unique: true });

const ClickCount = mongoose.model('ClickCount', clickCountSchema);

module.exports = ClickCount;