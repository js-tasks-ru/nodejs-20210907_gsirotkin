const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat:ctx.user.id});

  ctx.body = {
    messages: messages.map(message => ({
      date: message.date,
      text: message.text,
      id: message._id,
      user: ctx.user.displayName,
    }))
  };
};
