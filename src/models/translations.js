const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TranslateSchema = new Schema({
  phrase: { type: String, required: true },
  translation: { type: String, required: true }
})

module.exports = mongoose.model('Translation', TranslateSchema)
