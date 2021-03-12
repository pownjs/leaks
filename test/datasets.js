const assert = require('assert')
const jsYaml = require('js-yaml')
const path = require('path')
const fs = require('fs')

const db = require('../lib/db')
const { LeaksPilot } = require('../lib/leaks')

describe('datasets', () => {
    it('viv-1615539741', async() => {
        const dataset = jsYaml.load(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'viv-1615539741.yaml')))

        const lp = new LeaksPilot({ db })

        for (let { valid, invalid } of dataset) {
            let gotOne = false

            for await (const match of lp.iterateOverSearch(valid || invalid)) {
                match;

                gotOne = true
            }

            if (valid) {
                assert.ok(gotOne, `Valid secret ${JSON.stringify(valid)} should match`)
            }
            else {
                assert.ok(!gotOne, `invalid secret ${JSON.stringify(invalid)} should not match`)
            }
        }
    })
})
