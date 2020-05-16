/* ROUTES */
const express = require('express')
const router = express.Router()

const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')

router.post('/login', (req, res, next) => {
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

        return res.redirect('/')
      })
    })(req, res, next)
})

router.get('/login',
  (req, res) => res.sendFile('../html/login.html',
    { root: __dirname })
)

router.get('/logout', connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    req.logout()
    res.redirect('/')
  }
)

router.get('/',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('../html/index.html', { root: __dirname })
)

router.get('/private',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('../html/private.html', { root: __dirname })
)

router.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({ user: req.user })
)

module.exports = router
