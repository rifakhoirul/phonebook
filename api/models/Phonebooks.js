const { Schema, model } = require('mongoose');

const phonebooksSchema = new Schema({
    name: String,
    phone: String,
},
    {
        timestamps: true
    })

module.exports = model('Phonebooks', phonebooksSchema)

