const mongoose = require('mongoose')

const Url = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
},{
    collection: 'Url'
})

module.exports = mongoose.model('Url', Url);