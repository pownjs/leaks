[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/@pown/leaks.svg)](https://www.npmjs.com/package/@pown/leaks)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)

# Pown Leaks

Pown Leaks is an active database of regular expressions that help you search for leaks, such as passwords, keys, tokens and other sensitive strings in files.

## Credits

Some signatures were borrowed or heavily inspired by the following projects:

* gitleaks - https://github.com/zricethezav/gitleaks
* shhgit - https://github.com/eth0izzle/shhgit

This tool is part of [secapps.com](https://secapps.com) open-source initiative.

```
  ___ ___ ___   _   ___ ___  ___
 / __| __/ __| /_\ | _ \ _ \/ __|
 \__ \ _| (__ / _ \|  _/  _/\__ \
 |___/___\___/_/ \_\_| |_|  |___/
  https://secapps.com
```

### Authors

* [@pdp](https://twitter.com/pdp) - https://pdparchitect.github.io/www/

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown), but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Install leaks:

```sh
$ pown modules install @pown/leaks
```

Invoke directly from Pown:

```sh
$ pown leaks
```

### Standalone Use

Install this module locally from the root of your project:

```sh
$ npm install @pown/leaks --save
```

Once done, invoke pown cli:

```sh
$ POWN_ROOT=. ./node_modules/.bin/pown-cli leaks
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown leaks
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown leaks <location>

Find leaks

Options:
  --version                      Show version number  [boolean]
  --help                         Show help  [boolean]
  --header, -H                   Custom header  [string]
  --retry, -r  [number] [default: 5]
  --timeout, -t  [number] [default: 30000]
  --task-concurrency, -C  [number] [default: Infinity]
  --request-concurrency, -c  [number] [default: Infinity]
  --summary, -s  [boolean] [default: false]
  --json, -j  [boolean] [default: false]
  --unique, -u  [boolean] [default: false]
  --embed, -e  [boolean] [default: false]
  --write, -w  [string] [default: ""]
  --filter-title, --title  [string] [default: ""]
  --filter-severity, --severity  [number] [default: 0]
  --verbose, -V  [boolean] [default: "Run in verbose mode"]
```

## How To Contribute

Have a look at the `./lib/db` folder which contains all signatures. Insert your signatures using the naming convention and format and submit a pull request.
