const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    let order = await Order.create({
        user: ctx.user,
        product: ctx.request.body.product,
        phone: ctx.request.body.phone,
        address: ctx.request.body.address
    });

    order = await Order.findOne({_id: order.id}).populate('product');

    await sendMail({
        template: 'order-confirmation',
        locals: {
            id: order.id,
            product: {title: order.product.title}
        },
        to: ctx.user.email,
        subject: 'Заказ',
        });
    
    ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user: ctx.user}).populate('product');
    ctx.body = {orders};
};
