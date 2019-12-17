var mongoose = require('mongoose');

var restaurantSchema = mongoose.Schema({
    name : String,
    location : String,
    phone : String,
    email : String,
    web : String,
    city : String

}, {
    collection: 'restaurant'
});

module.exports = mongoose.model('restaurant', restaurantSchema);