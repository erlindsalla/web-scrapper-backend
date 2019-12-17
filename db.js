var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017' , { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));
db.once('open',  () => {
	console.log('connected to database successfuly...')
})