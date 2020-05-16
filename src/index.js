require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Set App Variable
const app = express()

// Express
app.use(express.static(__dirname))

// const expressSession = require('express-session')({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// })

// Passport
const passport = require('passport')

app.use(passport.initialize())
app.use(passport.session())

/* PASSPORT LOCAL AUTHENTICATION */
// const UserDetails = require('./models/users')

const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema
const UserDetail = new Schema({
  username: String,
  password: String
})

UserDetail.plugin(passportLocalMongoose)
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo')

passport.use(UserDetails.createStrategy())

passport.serializeUser(UserDetails.serializeUser())
passport.deserializeUser(UserDetails.deserializeUser())

// Use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  const now = new Date().toString()
  console.log(`Requested ${req.url} at ${now}`)
  next()
})

// Database Setup
require('./config/db-setup.js')

// Routes
const router = require('./controllers/translations.js')
app.use(router)

// const routes = require('./routes/users.js')
// app.use(routes)
/* ROUTES */

const connectEnsureLogin = require('connect-ensure-login')

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.redirect('/login?info=' + info)
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }
        console.log('Successful login', user)
        return res.redirect('/')
      })
    })(req, res, next)
})

app.post('/signup', (req, res, next) => {
  UserDetails.register({ username: req.body.username, active: false }, req.body.password)
  console.log('Registered', req.body)
  res.redirect('/')
})

app.get('/signup',
  (req, res) => res.sendFile('html/signup.html',
    { root: __dirname })
)

app.get('/logout',
  (req, res) => {
    req.logout()
    res.redirect('/')
  })

app.get('/',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('html/index.html', { root: __dirname })
)

app.get('/login',
  (req, res) => res.sendFile('html/login.html',
    { root: __dirname })
)

app.get('/private',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('html/private.html', { root: __dirname })
)

app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({ user: req.user })
)

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`)
})

module.exports = app
