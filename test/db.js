const assert = require('assert')

const db = require('../lib/db')
const { compileCheck } = require('../lib/helpers')

describe('db', () => {
    it('db is ok', () => {
        assert.ok(db, 'db exists')

        Object.entries(db).forEach(([name, { checks }]) => {
            checks.forEach((check, index) => {
                assert.ok(check.title, `title exists for ${name}.${index}`)
            })
        })
    })

    it('db checks validate', () => {
        Object.entries(db).forEach(([name, { checks }]) => {
            checks.forEach((check) => {
                const { title, regex, test, tests = [] } = check

                assert.ok(!test)

                if (tests) {
                    const { possitive, negative } = tests

                    compileCheck(regex)

                    if (possitive) {
                        const { regex: r } = compileCheck(check)

                        possitive.forEach((test, index) => {
                            assert.ok(r.test(test), `${title} validates against possitive test ${index}`)
                        })
                    }

                    if (negative) {
                        const { regex: r } = compileCheck(check)

                        negative.forEach((test, index) => {
                            assert.ok(!r.test(test), `${title} validates against negative test ${index}`)
                        })
                    }
                }
            })
        })
    })
})
