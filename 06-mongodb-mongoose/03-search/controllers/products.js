const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  const product = await Product.find(
    {$text : {$search : query, $diacriticSensitive: true}}, 
    {score : {$meta: "textScore"}}
  )
  .sort({score : {$meta : 'textScore'}});

  ctx.body = {
    products: product.map(product => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
    })),
  };
};
