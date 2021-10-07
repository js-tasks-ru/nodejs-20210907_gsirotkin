const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {

    const user = await User.findOne({email});
    
    if(!user) return done(null, false, 'Нет такого пользователя');
    
    const isValidPAssword = await user.checkPassword(password);
    
    if(!isValidPAssword) return done(null, false, 'Неверный пароль');

    done(null, user);
    },
);

/*
 module.exports = new LocalStrategy(
     {usernameField: 'email', session: false},
-    function(email, password, done) {
-      done(null, false, 'Стратегия подключена, но еще не настроена');
+    async function(email, password, done) {
+
+    await User.findOne({email: email}, async function(err, user){
ни в коем случае не стоит смешивать логику async/await и колбеков без необходимости. 
такой код намного более запутанный и его очень сложно читать.
лучше обойтись без вложенности вовсе:

const user = await User.findOne();
if (!user) ...
const isValidPassword = await user.checkPassword(password);
if (!isValidPassword) ...

---------------------------never do that------------------------------
    // await User.findOne({email: email}, async function(err, user){
    //     if(err) return done(err);
    //     if(!user) return done(null, false, 'Нет такого пользователя');

    //     if(!await new User(user).checkPassword(password)){
    //       return done(null, false, 'Неверный пароль');
    //     }
    //     done(null ,user);
    //   });
*/
