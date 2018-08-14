var UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('User', EventSchema);