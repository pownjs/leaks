const assert = require('assert')

const db = require('../lib/db')

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
            checks.forEach(({ title, regex, test, tests }) => {
                assert.ok(!test)

                if (tests) {
                    const { possitive, negative } = tests

                    new RegExp(regex, 'i')

                    if (possitive) {
                        const r = new RegExp(regex, 'i')

                        possitive.forEach((test, index) => {
                            assert.ok(r.test(test), `${title} validates against possitive test ${index}`)
                        })
                    }

                    if (negative) {
                        const r = new RegExp(regex, 'i')

                        negative.forEach((test, index) => {
                            assert.ok(!r.test(test), `${title} validates against negative test ${index}`)
                        })
                    }
                }
            })
        })
    })
})
