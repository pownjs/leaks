const assert = require('assert')

const db = require('../lib/db')

describe('db', () => {
    it('db is ok', () => {
        assert.ok(db)
    })
})
