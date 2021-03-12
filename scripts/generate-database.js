const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')

const databaseRoot = path.join(__dirname, '..', 'database')

const db = {}

for (let file of fs.readdirSync(databaseRoot)) {
    const doc = jsYaml.load(fs.readFileSync(path.join(databaseRoot, file)).toString())

    for (let check of doc.checks) {
        delete check.tests
    }

    db[path.basename(file, '.yaml')] = doc
}

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'database.json'), JSON.stringify(db, '', '  '))
