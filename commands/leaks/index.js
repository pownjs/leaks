exports.yargs = {
    command: 'leaks [location]',
    describe: 'Find leaks',
    aliases: ['leak'],

    builder: (yargs) => {
        yargs.options('header', {
            alias: ['H'],
            type: 'string',
            describe: 'Custom header'
        })

        yargs.options('retry', {
            alias: ['r'],
            type: 'number',
            default: 5
        })

        yargs.options('timeout', {
            alias: ['t'],
            type: 'number',
            default: 30000
        })

        yargs.options('task-concurrency', {
            alias: ['C'],
            type: 'number',
            default: Infinity
        })

        yargs.options('request-concurrency', {
            alias: ['c'],
            type: 'number',
            default: Infinity
        })

        yargs.options('silent', {
            alias: ['s'],
            type: 'boolean',
            default: false
        })

        yargs.options('json', {
            alias: ['j'],
            type: 'boolean',
            default: false
        })

        yargs.options('unique', {
            alias: ['u'],
            type: 'boolean',
            default: false
        })

        yargs.options('embed', {
            alias: ['e'],
            type: 'boolean',
            default: false
        })

        yargs.options('write', {
            alias: ['w'],
            type: 'string',
            default: ''
        })

        yargs.options('tokenizer', {
            alias: ['z'],
            type: 'string',
            choices: ['none', 'code-line'],
            default: 'code-line'
        })

        yargs.options('filter-title', {
            alias: ['title', 'filter-name', 'name'],
            type: 'string',
            default: ''
        })

        yargs.options('filter-severity', {
            alias: ['severity', 'filter-level', 'level'],
            type: 'number',
            default: 0
        })
    },

    handler: async(args) => {
        let { header } = args

        const { retry, timeout, requestConcurrency, taskConcurrency, silent, json, unique, embed, write, tokenizer, filterTitle, filterSeverity, location } = args

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
        const path = require('path')
        const { promisify } = require('util')
        const { makeLineIterator } = require('@pown/cli/lib/line')

        const statAsync = promisify(fs.stat)
        const readdirAsync = promisify(fs.readdir)
        const readFileAsync = promisify(fs.readFile)

        const { Scheduler } = require('@pown/request/lib/scheduler')

        const scheduler = new Scheduler({ maxConcurrent: requestConcurrency })

        const options = {
            scheduler,
            headers,
            retry,
            timeout
        }

        const fetchRequest = async(location) => {
            const { responseBody } = await scheduler.request({ ...options, uri: location })

            return responseBody
        }

        const fetchFile = async(location) => {
            const data = await readFileAsync(location)

            return data
        }

        const it = async function*() {
            const lit = makeLineIterator(location)

            for await (let loc of lit()) {
                if (/^https?:\/\//i.test(loc)) {
                    yield { type: 'request', location: loc }
                }
                else {
                    let stat

                    try {
                        stat = await statAsync(loc)
                    }
                    catch (e) {}

                    if (!stat) {
                        continue
                    }

                    async function* recurseDirectory(directory) {
                        for (let entry of await readdirAsync(directory, { withFileTypes: true })) {
                            const pathname = path.join(directory, entry.name)

                            if (entry.isDirectory()) {
                                yield* recurseDirectory(pathname)
                            }
                            else {
                                yield { type: 'file', location: pathname }
                            }
                        }
                    }

                    if (stat.isDirectory()) {
                        yield* recurseDirectory(loc)
                    }
                    else {
                        yield { type: 'file', location: loc }
                    }
                }
            }
        }

        let print = (location, result, text) => {
            const { check, index, exact, find } = result
            const { severity, title, regex } = check

            if (json) {
                const object = { location, severity, title, index, exact, find, regex: regex.toString() }

                if (embed) {
                    object['contents'] = text
                }

                console.log(JSON.stringify(object))
            }
            else {
                if (!silent) {
                    console.warn(`title: ${title}, severity: ${severity}, index: ${index}, location: ${location}`)
                }

                console.log(find)
            }
        }

        if (write) {
            print = ((print) => {
                const { createWriteStream } = require('fs')

                const ws = createWriteStream(write)

                return (location, result, text) => {
                    const { check, index, find } = result
                    const { severity, title, regex } = check

                    const object = { location, severity, title, index, exact, find, regex: regex.toString() }

                    if (embed) {
                        object['contents'] = text
                    }

                    ws.write(JSON.stringify(object))
                    ws.write('\n')

                    print(location, result, text)
                }
            })(print)
        }

        if (unique) {
            print = ((print) => {
                const hash = {}

                return (location, result, text) => {
                    if (hash[result.find]) {
                        return
                    }

                    hash[result.find] = true

                    print(location, result, text)
                }
            })(print)
        }

        const { LeaksPilot } = require('../../lib/leaks')

        const lp = new LeaksPilot({ db: { ...require('../../lib/db'), ...require('../../lib/scanners') }, title: filterTitle, severity: filterSeverity })

        let iterator

        if (tokenizer === 'none') {
            iterator = (...args) => {
                return lp.iterateOverSearch(...args)
            }
        }
        else
        if (tokenizer === 'code-line') {
            iterator = (...args) => {
                return lp.iterateOverSearchPerCodeLine(...args)
            }
        }
        else {
            throw new Error(`Unrecognized tokenizer`)
        }

        const { eachOfLimit } = require('@pown/async/lib/eachOfLimit')

        await eachOfLimit(it(), taskConcurrency, async({ type, location }) => {
            let fetch

            if (type === 'request') {
                fetch = fetchRequest
            }
            else
            if (type === 'file') {
                fetch = fetchFile
            }
            else {
                throw new Error(`Unknown type ${type}`)
            }

            try {
                const data = await fetch(location)
                const text = data.toString()

                for await (let result of iterator(text)) {
                    print(location, result, text)
                }
            }
            catch (e) {
                console.error(e)
            }
        })
    }
}
