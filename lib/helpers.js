const compileCheck = (check) => {
    const { regex = '', flags = '', ...rest } = check

    return {
        ...rest,

        regex: new RegExp(regex, flags)
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
