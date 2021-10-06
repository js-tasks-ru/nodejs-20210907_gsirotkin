const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {

    await User.findOne({email: email}, async function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false, 'Нет такого пользователя');

        if(!await new User(user).checkPassword(password)){
          return done(null, false, 'Неверный пароль');
        }
        done(null ,user);
      });
    },
);
