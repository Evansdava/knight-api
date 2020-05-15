const express = require('express')
const router = express.Router()

const Translation = require('../models/translations')

// ALL TRANLSATIONS
router.get('/translations', (req, res) => {
  Translation.find().lean()
    .then(translations => {
      return res.json({ translations })
    })
    .catch((err) => {
      throw err.translation
    })
})

// SINGLE TRANSLATION
router.get('/translation/:translationId', (req, res) => {
  Translation.findOne({ _id: req.params.translationId }).lean()
    .then(translation => {
      return res.json(translation)
    })
    .catch((err) => {
      throw err.translation
    })
})

// RANDOM TRANSLATION
router.get('/random', (req, res) => {
  // https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose

  // Get the count of all translations
  Translation.count().exec(function (err, count) {
    // Get a random entry
    var random = Math.floor(Math.random() * count)

    // Again query all Translations but only fetch one offset by our random #
    Translation.findOne().skip(random).exec(
      function (err, result) {
        if (err) {
          throw err.translation
        }
        // Tada! random Translation
        return res.json(result)
      })
    if (err) {
      throw err.translation
    }
  })
})

// ADD NEW TRANSLATION
router.post('/translation', (req, res) => {
  const translation = new Translation(req.body)
  translation.save()
    .then(() => {
      return res.send(translation)
    }).catch(err => {
      throw err.translation
    })
})

// UPDATE
router.put('/translations/:translationID', (req, res) => {
  // Update the matching translation using `findByIdAndUpdate`
  Translation.findByIdAndUpdate(req.params.translationID, req.body).then(() => {
    return Translation.findOne({ _id: req.params.translationID })
  }).then((translation) => {
    // Return the updated translation object as JSON
    return res.json({ translation })
  }).catch((err) => {
    throw err.translation
  })
})

// DELETE
router.delete('/translations/:translationID', (req, res) => {
  // to also delete the translation from the User object's `translations` array
  Translation.findByIdAndDelete(req.params.translationID)
    .then((result) => {
      if (result === null) {
        return res.json({ translation: 'translation does not exist.' })
      }
      return res.json({
        translation: 'Successfully deleted.',
        _id: req.params.translationID
      })
    })
    .catch((err) => {
      throw err.translation
    })
})

module.exports = router
