const { eachMatch } = require('@pown/regexp/lib/eachMatch')

class LeaksPilot {
    constructor(options) {
        const { db, title = '', severity = 0 } = options || {}

        this.db = db
        this.title = title
        this.severity = severity
    }

    async * generateChecks(options) {
        const { title = this.title, severity = this.severity } = options || {}

        const tests = []

        if (title) {
            tests.push((check) => {
                return (check.title || '').toLowerCase().indexOf(title.toLowerCase()) >= 0
            })
        }

        tests.push((check) => {
            return (check.severity || 10) >= severity
        })

        for (const category of Object.values(this.db)) {
            const { checks } = category

            for (const check of checks) {
                if (tests.every(f => f(check))) {
                    yield check
                }
            }
        }
    }

    async * iterateOverSearch(input, options) {
        for await (const check of this.generateChecks(options)) {
            if (process.env.POWN_DEBUG_XXL) {
                console.debug(`starting check ${check.title}`)
                console.time(`leaks: check ${check.title}`)
            }

            const { scan } = check

            if (scan) {
                for (let { index, exact, find } of scan(input, options)) {
                    yield { check, index, exact, find }
                }
            }
            else {
                throw new Error(`Unexpected state`)
            }

            if (process.env.POWN_DEBUG_XXL) {
                console.timeEnd(`leaks: check ${check.title}`)
            }
        }
    }

    async * iterateOverSearchPerCodeLine(input, options) {
        const { tokenizer = /(.+?)[;\n]*$/gm } = options || {}

        for await (let match of eachMatch(tokenizer, input)) {
            const { index, 1: line } = match

            for await (let submatch of this.iterateOverSearch(line, options)) {
                yield { ...submatch, line, index: index + submatch.index }
            }
        }
    }
}

module.exports = { LeaksPilot }
