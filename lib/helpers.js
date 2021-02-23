const { RegExp } = require('@pown/regexp/lib/regexp')

const compileCheck = (check) => {
    const { regex = '', regexFilter, flags = 'i', filterFlags = 'i', ...rest } = check

    const r = regex ? new RegExp(regex, flags) : undefined
    const rf = regexFilter ? new RegExp(regexFilter, filterFlags) : undefined

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
