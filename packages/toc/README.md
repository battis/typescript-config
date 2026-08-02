# @battis/toc

Auto-generated package table of contents for monorepo README files

[![npm version](https://badge.fury.io/js/@battis/%2Ftoc.svg)](https://npmjs.com/package/@battis/toc)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

## Install

This workflow is a subcommand of the [msar](https://www.npmjs.com/package/msar) tool, which can be installed using `npm` (or your preferred equivalent):

```bash
npm install @battis/toc
```

In `package.json`:

```json
{
  "scripts": {
    "toc": "toc -O -d 2 -t ./docs/toc-template.md -o ./README.md ./packages"
  }
}
```

## Usage

Usage:

<pre lang="bash">toc -hOr --o=&lt;outputPath&gt; --t=&lt;templatePath&gt; --d=&lt;depth&gt; --title=&lt;title&gt; --heading=&lt;heading&gt; --logFilePath=&lt;logFilePath&gt; --stdoutLevel=&lt;all|trace|debug|info|warning|error|fatal|off&gt; --fileLevel=&lt;all|trace|debug|info|warning|error|fatal|off&gt; <u>scanPath</u></pre>



######## Positional arguments

######## <u>`scanPath`</u>

Path to a directory to scan for packages

####### Arguments

#### `-h --help`

Show this usage information

######## TOC Options

Generates a table of contents for a given directory by scanning all of the subdirectories for packages with README files. To be included in the TOC, the package must have both a `name` and `description` and links are directly to the README file.

######### `-o<outputPath> --outputPath=<outputPath>`

Path to TOC output file (defaults to `<u>`scanPath`</u>/README.md}`)

######### `-t<templatePath> --templatePath=<templatePath>`

Path to template into which to insert TOC at `{{TOC}}`

######### `--title=<title>`

Title of TOC list (Default: capitalized name of the `--scanPath`)

######### `-O --overwrite`

Overwrite any existing TOC if present (Default: `false`)

######### `-r --recursive`

Whether or not to recursively traverse <u>`scanPath`</u> (Default: `false`)

######### `-d<n> --depth=<n>`

If making at `--recursive` scan, the maximum depth to scan

######### `--heading=<n>`

Heading level of TOC title (all others will be nested subheadings of this level) (Default: `2`)

######## Logging options

######### `--logFilePath=<logFilePath>`

Path to log file (optional)

######### `--stdoutLevel=<all|trace|debug|info|warning|error|fatal|off>`

Log level to console stdout (Default: `"info"`)

######### `--fileLevel=<all|trace|debug|info|warning|error|fatal|off>`

Log level to log file if `--logFilePath` provided (Default: `"all"`)
