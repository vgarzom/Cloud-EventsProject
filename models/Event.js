var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    name: String,
    description: String,
    created_date: {type: Date, default: Date.now},
    event_date: {type: Date, default: Date.now},
    duration: Number,
    category: String,
    place: String,
    type: String
})

module.exports = mongoose.model('Event', EventSchema);