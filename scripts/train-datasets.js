const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')
const natural = require('natural')
const brainJs = require('brain.js')

const files = fs.readdirSync(path.join(__dirname, '..', 'datasets'))

const data = [].concat(...files.map((file) => {
    return jsYaml.load(fs.readFileSync(path.join(__dirname, '..', 'datasets', file)))
}))

const tokenize = (input) => {
    return input.split(/[;"'=\s]+/g)
}

const buildWordDictionary = (trainingData) => {
    const tokenisedArray = trainingData.map(({ valid, invalid }) => {
        const tokens = tokenize(valid || invalid || '')
        return tokens.filter(t => t).map(token => natural.PorterStemmer.stem(token))
    })

    const flattenedArray = [].concat.apply([], tokenisedArray)

    return flattenedArray.filter((item, pos, self) => self.indexOf(item) == pos)
}

const dictionary = buildWordDictionary(data)
console.log(dictionary)
const encode = (phrase, dictionary) => {
    const phraseTokens = tokenize(phrase)
    const encodedPhrase = dictionary.map(word => phraseTokens.includes(word) ? 1 : 0)

    return encodedPhrase
}

const trainingSet = data.map((dataSet) => {
    const encodedValue = encode(dataSet.valid || dataSet.invalid, dictionary)
    return { input: encodedValue, output: { valid: (dataSet.valid ? 1 : 0), invalid: (dataSet.invalid ? 1 : 0) } }
})

const network = new brainJs.NeuralNetwork()
network.train(trainingSet)

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'network.js'), `module.exports = { network: ${ network.toFunction().toString() } }`)
