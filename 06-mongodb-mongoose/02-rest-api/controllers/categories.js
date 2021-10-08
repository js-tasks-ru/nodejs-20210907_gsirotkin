const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const category = await Category.find().populate('subcategories');
  ctx.body = {
    categories: category.map(category => ({
      id: category._id,
      title: category.title,
      subcategories: category.subcategories.map(sub => ({
        id: sub._id,
        title: sub.title,
      })),

    }))
  };
};
