const aws = require('./aws.json')
const slack = require('./slack.json')
const crypto = require('./crypto.json')
const stripe = require('./stripe.json')
const github = require('./github.json')
const twitter = require('./twitter.json')
const facebook = require('./facebook.json')

const { compileCollection } = require('../helpers')

module.exports = {
    aws: compileCollection(aws),
    slack: compileCollection(slack),
    crypto: compileCollection(crypto),
    stripe: compileCollection(stripe),
    github: compileCollection(github),
    twitter: compileCollection(twitter),
    facebook: compileCollection(facebook)
}
