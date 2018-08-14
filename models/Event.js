var EventSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    name: String,
    description: String,
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Event', EventSchema);