const fs = require('fs')
const path = require('path')
const assert = require('assert')
const jsYaml = require('js-yaml')
const safeRegex = require('safe-regex')

const { compileDatabase } = require('../lib/compile')

describe('database', () => {
    const databaseRoot = path.join(__dirname, '..', 'database')

    const database = compileDatabase(Object.assign({}, ...fs.readdirSync(databaseRoot).map((file) => {
        const doc = jsYaml.load(fs.readFileSync(path.join(databaseRoot, file)).toString())

        return {
            [path.basename(file, '.yaml')]: doc
        }
    })))

    it('database is ok', () => {
        assert.ok(database, 'database exists')

        Object.entries(database).forEach(([name, { checks }]) => {
            checks.forEach((check, index) => {
                assert.ok(check.title, `title exists for ${name}.${index}`)
            })
        })
    })

    it('database checks validate', () => {
        const first = (it) => Array.from(it)[0]

        Object.entries(database).forEach(([name, { checks }]) => {
            checks.forEach((check) => {
                const { title, regex, test, tests = [], safe = true } = check

                assert.ok(!test, `${JSON.stringify(title)} has incorrect test declaration`)

                if (tests) {
                    const { possitive, negative } = tests

                    if (possitive) {
                        const { scan } = check

                        possitive.forEach((test, index) => {
                            const result = first(scan(test))

                            assert.ok(result, `${JSON.stringify(title)} validates against possitive test ${JSON.stringify(test)} at index ${index}`)
                        })
                    }

                    if (negative) {
                        const { scan } = check

                        negative.forEach((test, index) => {
                            const result = first(scan(test))

                            assert.ok(!result, `${JSON.stringify(title)} validates against negative test ${JSON.stringify(test)} at index ${index}`)
                        })
                    }

                    if (safe) {
                        assert.ok(safeRegex(regex), `${JSON.stringify(title)} validates safe regex test ${regex.toString()}`)
                    }
                }
            })
        })
    })
})
