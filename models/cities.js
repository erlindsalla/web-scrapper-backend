var mongoose = require('mongoose');

var CitySchema = mongoose.Schema({
    "name" : String,
}, {
    collection: 'city'
});

module.exports = mongoose.model('city', CitySchema);