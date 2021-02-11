const modules = {
    title: 'NPM Module',

    severity: 1,

    scan: function*(input) {
        const regex = /"(?:dependencies|devDependencies)":\s*(\{.+?\})/g

        let match

        while ((match = regex.exec(input)) !== null) {
            const { index, 1: find } = match

            let deps

            try {
                deps = JSON.parse(find)
            }
            catch (e) {}

            if (deps) {
                for (let [name, version] of Object.entries(deps)) {
                    yield { index, find: `${name}@${version}` }
                }
            }
        }
    }
}

module.exports = {
    title: 'NPM Module Enumeration',
    checks: [modules]
}
