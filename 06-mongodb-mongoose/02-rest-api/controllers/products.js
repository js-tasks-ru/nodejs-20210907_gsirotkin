const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  if(!mongoose.Types.ObjectId.isValid(subcategory)){
    ctx.status = 400;
    ctx.body = 'bad request';
    return;
  }

  const products = await Product.find({subcategory: subcategory});

  if(!products.length) ctx.status = 404;

  
  ctx.body = {
    products: products.map(product => ({
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description,
    }))};
};

module.exports.productList = async function productList(ctx, next) {
  
  const products = await Product.find();

  ctx.body = {
    products: products.map(product => ({
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description,
    }))};
};

module.exports.productById = async function productById(ctx, next) {

  if(!mongoose.Types.ObjectId.isValid(ctx.params.id)){
    ctx.status = 400;
    ctx.body = 'bad request';
    return;
  }

  const product = await Product.findOne({_id: ctx.params.id});

  if(!product){
    ctx.status = 404;
    ctx.body = 'Product not found';
    return;
  }

  ctx.body = {
    product: {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description,
      }
  };
};
