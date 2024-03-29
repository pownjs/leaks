> The project has moved to monorepo. See https://github.com/pownjs/pown for more information.

[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/@pown/leaks.svg)](https://www.npmjs.com/package/@pown/leaks)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/leaks/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown Leaks

Pown Leaks is a comprehensive database of regular expressions that help you search for leaks, such as passwords, keys, tokens and other sensitive strings in files.

## Credits

Some signatures were borrowed or heavily inspired by the following projects:

* gitleaks - https://github.com/zricethezav/gitleaks
* shhgit - https://github.com/eth0izzle/shhgit
* SecretsScanner - https://github.com/deepfence/SecretScanner/

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
pown-cli leaks <command>

Leaks / secrets detection tool

Commands:
  pown-cli leaks [location]     Find leaks  [default]
  pown-cli leaks export [file]  Export leaks database

Options:
  --version                                                 Show version number  [boolean]
  --help                                                    Show help  [boolean]
  --request-concurrency, -c                                 The number of requests to send at the same time  [number] [default: Infinity]
  --method, -X                                              Custom method  [string]
  --header, -H                                              Custom header  [string]
  --connect-timeout, -t, --timeout                          Maximum time allowed for the connection to start  [number] [default: 30000]
  --data-timeout, -T                                        Maximum time allowed for the data to arrive  [number] [default: 30000]
  --accept-unauthorized, -k, --insecure                     Accept unauthorized TLS errors  [boolean] [default: false]
  --filter-response-code, --response-code, --filter-status  Filter responses with code  [string] [default: ""]
  --content-sniff-size, --content-sniff, --sniff-size       Specify the size of the content sniff  [number] [default: 5]
  --print-response-body, --print-body                       Print response body  [boolean] [default: false]
  --download-response-body, --download-body                 Download response body  [boolean] [default: false]
  --proxy-url, --proxy                                      Setup proxy  [string] [default: ""]
  --task-concurrency, -C  [number] [default: Infinity]
  --silent, -s  [boolean] [default: false]
  --json, -j  [boolean] [default: false]
  --unique, -u  [boolean] [default: false]
  --embed, -e  [boolean] [default: false]
  --write, -w  [string] [default: ""]
  --tokenizer, -z  [string] [choices: "none", "code-line"] [default: "code-line"]
  --filter-title, --title, --filter-name, --name  [string] [default: ""]
  --filter-severity, --severity, --filter-level, --level  [number] [default: 0]
```

## How To Contribute

Have a look at the `./database` folder which contains all signatures. Insert your signatures using the naming convention and format and submit a pull request.
