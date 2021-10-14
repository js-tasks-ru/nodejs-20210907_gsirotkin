const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.plugin(beautifyUnique);

//переопределение дефолтного сообщения об ошибке
//mongoose.plugin(beautifyUnique, {defaultMessage: `Такой {PATH} уже существует`});

module.exports = mongoose.createConnection(config.mongodb.uri);
