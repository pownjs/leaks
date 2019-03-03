class LeaksPilot {
    constructor(options) {
        const { db } = options || {}

        this.db = db
    }

    async * generateChecks() {
        for await (const category of Object.values(this.db)) {
            const { checks } = category

            for await (const check of checks) {
                yield check
            }
        }
    }

    async * iterateOverSearch(input, flags = '') {
        for await (const check of this.generateChecks()) {
            const { regex, ...rest } = check

            // We always set flags to 'g' or we will run into infinite loop
            // problems as per the spec.

            const re = new RegExp(regex, (flags || regex.flags || '') + 'g')

            let match

            while ((match = re.exec(input)) !== null) {
                const { index, 0: find } = match

                yield { check, index, find }
            }
        }
    }
}

module.exports = { LeaksPilot }
