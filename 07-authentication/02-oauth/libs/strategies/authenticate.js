const User = require('../../models/User.js');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if(!email) return done(null, false, 'Не указан email');

    let user = await User.findOne({email});

    if(user) return done(null, user);

    user = await User.create({
        email: email,
        displayName: displayName
    }); //catch(err => done(err)); //тут не нужен .catch() ,т.к.
        //ошибки "выпадут" в catch блока try/catch и все будет корректно обработано.

    done(null, user);

  } catch(err) {
    done(err);
  }
};
