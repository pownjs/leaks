exports.yargs = {
    command: 'leaks <location>',
    describe: 'Find leaks',

    builder: (yargs) => {
        yargs.options('header', {
            alias: 'H',
            type: 'string',
            describe: 'Custom header'
        })

        yargs.options('retry', {
            alias: 'r',
            type: 'number',
            default: 5
        })

        yargs.options('timeout', {
            alias: 't',
            type: 'number',
            default: 30000
        })

        yargs.options('task-concurrency', {
            alias: 'C',
            type: 'number',
            default: Infinity
        })

        yargs.options('request-concurrency', {
            alias: 'c',
            type: 'number',
            default: Infinity
        })
    },

    handler: async(args) => {
        let { header } = args

        const { retry, timeout, requestConcurrency, taskConcurrency, location } = args

        const headers = {}

        if (header) {
            if (!Array.isArray(header)) {
                header = [header]
            }

            for (let entry of header) {
                let [name = '', value = ''] = entry.split(':', 1)

                name = name.trim() || entry
                value = value.trim() || ''

                if (headers[name]) {
                    if (!Array.isArray(headers[name])) {
                        headers[name] = [headers[name]]
                    }

                    headers[name].push(value)
                }
                else {
                    headers[name] = value
                }
            }
        }

        const fs = require('fs')
        const { promisify } = require('util')

        const readFileAsync = promisify(fs.readFile)

        let scheduler

        try {
            const { Scheduler } = require('@pown/request/lib/scheduler')

            scheduler = new Scheduler({ maxConcurrent: requestConcurrency })
        }
        catch (e) {
            // pass
        }

        const options = {
            scheduler,
            headers,
            retry,
            timeout
        }

        const fetchRequest = async(location) => {
            if (!scheduler) {
                console.warn('@pown/request not available')

                return ''
            }

            const { responseBody } = await scheduler.request({ ...options, uri: location })

            return responseBody
        }

        const fetchFile = async(location) => {
            const data = await readFileAsync(location)

            return data
        }

        let it

        if (location === true) {
            const process = require('process')
            const readline = require('readline')

            rl = readline.createInterface({
                input: process.stdin
            })

            it = async function*() {
                for await (let line of rl) {
                    yield line
                }
            }
        }
        else {
            it = function*() {
                yield location
            }
        }

        const { LeaksPilot } = require('../lib/leaks')

        const lp = new LeaksPilot({ db: require('../lib/db') })

        const { eachOfLimit } = require('@pown/async/lib/eachOfLimit')

        await eachOfLimit(it(), taskConcurrency, async(location) => {
            let fetch

            if (/^https?:\/\//.test(location)) {
                fetch = fetchRequest
            }
            else {
                fetch = fetchFile
            }

            const data = await fetch(location)

            for await (let result of lp.iterateOverSearch(data.toString())) {
                const { check, find } = result
                const { severity, title } = check

                console.warn(`[${severity}][${title}] ${find}`)
            }
        })
    }
}