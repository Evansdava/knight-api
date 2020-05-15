require('dotenv').config()
const app = require('../index.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const mocha = require('mocha')

const Translation = require('../models/translations.js')

chai.config.includeStack = true

const expect = chai.expect
const describe = mocha.describe
const it = mocha.it
const after = mocha.after
const beforeEach = mocha.beforeEach
const afterEach = mocha.afterEach
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

// const SAMPLE_OBJECT_ID_1 = 'aaaaaaaaaaaa' // 12 byte string
const SAMPLE_OBJECT_ID_2 = 'bbbbbbbbbbbb' // 12 byte string

describe('Message API endpoints', () => {
  beforeEach((done) => {
  //   const sampleUser = new User({
  //     username: 'myuser',
  //     password: 'mypassword',
  //     _id: SAMPLE_OBJECT_ID_1
  //   })

    const sampleTranslation = new Translation({
      phrase: 'yes',
      translation: 'aye',
      _id: SAMPLE_OBJECT_ID_2
    })

    sampleTranslation.save()
      .then(() => {
        done()
      })
      .catch(err => {
        throw err.message
      })

  //   Promise.all([sampleUser.save(), sampleMessage.save()])
  //     .then(() => {
  //       done()
  //     })
  })

  afterEach((done) => {
    Translation.deleteMany({ _id: [SAMPLE_OBJECT_ID_2] })
      .then(() => {
        done()
      })
  })

  it('should get all translations', (done) => {
    chai.request(app)
      .get('/translations')
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.translations).to.be.an('array')
        done()
      })
  })

  it('should get one specific translation', (done) => {
    chai.request(app)
      .get(`/translation/${SAMPLE_OBJECT_ID_2}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.phrase).to.equal('yes')
        expect(res.body.translation).to.equal('aye')
        done()
      })
  })

  it('should get a random translation', (done) => {
    chai.request(app)
      .get('/random')
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('phrase')
        expect(res.body).to.have.property('translation')
        done()
      })
  })

  it('should post a new message', (done) => {
    chai.request(app)
      .post('/translation')
      .send({ phrase: 'no', translation: 'nay' })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('phrase', 'no')

        // check that phrase is actually inserted into database
        Translation.findOne({ phrase: 'no' }).then(translation => {
          expect(translation).to.be.an('object')
          done()
        })
      })
  })

  it('should update a translation', (done) => {
    chai.request(app)
      .put(`/translations/${SAMPLE_OBJECT_ID_2}`)
      .send({ phrase: 'no' })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res.body).to.be.an('object')
        expect(res.body.translation).to.have.property('phrase', 'no')

        // check that translation is actually inserted into database
        Translation.findOne({ phrase: 'no' }).then(message => {
          expect(message).to.be.an('object')
          done()
        })
      })
  })

  it('should delete a translation', (done) => {
    chai.request(app)
      .delete(`/translations/${SAMPLE_OBJECT_ID_2}`)
      .end((err, res) => {
        if (err) { done(err) }
        expect(res.body.translation).to.equal('Successfully deleted.')
        expect(res.body._id).to.equal(SAMPLE_OBJECT_ID_2)

        // check that translation is actually deleted from database
        Translation.findOne({ phrase: 'yes' }).then(translation => {
          expect(translation).to.equal(null)
          done()
        })
      })
  })
})
