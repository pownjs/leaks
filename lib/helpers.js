const { RegExp } = require('@pown/regexp/lib/regexp')

const compileCheck = (check) => {
    const { regex = '', regexFilter, flags = 'i', ...rest } = check

    const r = regex ? new RegExp(regex, flags) : undefined
    const rf = regexFilter ? new RegExp(regexFilter, flags) : undefined

    return {
        ...rest,

        regex: r,
        regexFilter: rf
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
