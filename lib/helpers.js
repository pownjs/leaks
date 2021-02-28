const { RegExp } = require('@pown/regexp/lib/regexp')
const { eachMatch } = require('@pown/regexp/lib/eachMatch')

const { calculateEntropy } = require('./entropy')

const compileCheck = (check) => {
    const { regex = '', filterRegex, flags = 'i', filterFlags = 'i', entropy, entropyScore, ...rest } = check

    const r = regex ? new RegExp(regex, flags) : undefined
    const fr = filterRegex ? new RegExp(filterRegex, filterFlags) : undefined
    const enc = entropyScore || entropy || 0

    const validate = (find) => {
        if (enc && calculateEntropy(find) < enc) {
            return false
        }

        if (fr && fr.test(find)) {
            return false
        }

        return true
    }

    return {
        ...rest,

        regex: r,
        filterRegex: fr,
        entropyScore: enc,

        scan: function*(input) {
            for (let match of eachMatch(r, input)) {
                const { index, 0: find } = match

                if (validate(find)) {
                    yield { check, index, find }
                }
            }
        }
    }
}

const compileCollection = (collection) => {
    const { checks, ...rest } = collection

    return {
        ...rest,

        checks: checks.map(compileCheck)
    }
}

module.exports = { compileCheck, compileCollection }
