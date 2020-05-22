const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://felypesa_12:123456789A@cluster0-22ojx.mongodb.net/money?retryWrites=true&w=majority', { UuseNewUrlParser: true,useUnifiedTopology: true })

mongoose.Promise = global.Promise;
module.exports = mongoose