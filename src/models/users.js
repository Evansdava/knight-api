const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: String,
  password: String
})

// schema maps to a collection
// const Schema = mongoose.Schema

// const UserSchema = new Schema({
//   username: {
//     type: 'String',
//     required: true,
//     trim: true,
//     unique: true
//   },
//   password: {
//     type: 'String',
//     required: true,
//     trim: true
//   }
// })

// // encrypt password before save
// UserSchema.pre('save', function (next) {
//   const user = this
//   if (!user.isModified || !user.isNew) { // don't rehash if it's an old user
//     next()
//   } else {
//     bcrypt.hash(user.password, 10, function (err, hash) {
//       if (err) {
//         console.log('Error hashing password for user', user.username)
//         next(err)
//       } else {
//         user.password = hash
//         next()
//       }
//     })
//   }
// })

const passportLocalMongoose = require('passport-local-mongoose')
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
