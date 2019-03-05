// It might make sense to keep this as logic-less as possible, i.e. no checking
// of severity and flags. This would mean that the database needs to be
// converted once and the rest is just simple loop.

class LeaksPilot {
    constructor(options) {
        const { db, flags = '', severity = 0 } = options || {}

        this.db = db
        this.flags = flags
        this.severity = severity
    }

    * generateChecks(options = {}) {
        const { severity = this.severity } = options

        for (const category of Object.values(this.db)) {
            const { checks } = category

            for (const check of checks) {
                if (severity >= (check.severity || 0)) {
                    yield check
                }
            }
        }
    }

    * iterateOverSearch(input, options = {}) {
        const { severity = this.severity, flags = this.flags } = options

        for (const check of this.generateChecks({ severity })) {
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
