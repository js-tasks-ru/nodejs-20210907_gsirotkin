const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const token = uuid();

    const user = await new User({
        email: ctx.request.body.email,
        displayName: ctx.request.body.displayName,
        verificationToken: token
    });

    await user.setPassword(ctx.request.body.password);
    await user.save();
    
    await sendMail({
        template: 'confirmation',
        locals: {token: user.verificationToken},
        to: user.email,
        subject: 'Подтвердите почту',
        });
    
    ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({verificationToken: ctx.request.body.verificationToken});

    if(!user) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');

    user.verificationToken = undefined;
    await user.save();

    const token = await ctx.login(user);

    ctx.body = {token: token};
};
