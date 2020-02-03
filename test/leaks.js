const assert = require('assert')

const { LeaksPilot } = require('../lib/leaks')

describe('LeaksPilot', () => {
    describe('#iterateOverSearch', () => {
        it('must not produce results', () => {
            const db = {}

            const lp = new LeaksPilot({ db })

            const results = []

            for (const match of lp.iterateOverSearch('')) {
                results.push(match)
            }

            assert.ok(results.length === 0)
        })

        it('must produce results', () => {
            const db = {
                test: {
                    checks: [{
                        regex: /secret/
                    }]
                }
            }

            const lp = new LeaksPilot({ db })

            const results = []

            for (const match of lp.iterateOverSearch('a b secret c secret x secret y z')) {
                results.push(match)
            }

            assert.ok(results.length === 3)
            assert.ok(results.every((result) => result.index > 0))
        })

        it('must produce results with groups', () => {
            const db = {
                test: {
                    checks: [{
                        regex: /secret\d+/
                    }]
                }
            }

            const lp = new LeaksPilot({ db })

            const results = []

            for (const match of lp.iterateOverSearch('a b secret1 c secret2 x secret3 y z')) {
                results.push(match)
            }

            assert.ok(results.length === 3)
            assert.ok(results.every((result) => result.index > 0))
            assert.deepEqual(results.map((result) => result.find), ['secret1', 'secret2', 'secret3'])
        })
    })

    describe('#iterateOverSearchPerLine', () => {
        it('must produce results with groups', () => {
            const db = {
                test: {
                    checks: [{
                        regex: /secret\d+/
                    }]
                }
            }

            const lp = new LeaksPilot({ db })

            const results = []

            for (const match of lp.iterateOverSearchPerLine('a\nb\nsecret1\nc\nsecret2\nx\nsecret3\ny\nz')) {
                results.push(match)
            }

            assert.ok(results.length === 3)
            assert.ok(results.every((result) => result.index > 0))
            assert.deepEqual(results.map((result) => result.find), ['secret1', 'secret2', 'secret3'])
        })
    })
})
