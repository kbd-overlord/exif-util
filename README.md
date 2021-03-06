# exif-util

CLI for inspecting and comparing exif tags

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![License](https://img.shields.io/npm/l/exif-util.svg)](https://npmjs.org/package/exif-util)
[![Version](https://img.shields.io/npm/v/exif-util.svg)](https://npmjs.org/package/exif-util)
[![Downloads/week](https://img.shields.io/npm/dw/exif-util.svg)](https://npmjs.org/package/exif-util)

<!-- toc -->
* [exif-util](#exif-util)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g exif-util
$ exif-util COMMAND
running command...
$ exif-util (-v|--version|version)
exif-util/0.0.4-alpha linux-x64 node-v16.13.0
$ exif-util --help [COMMAND]
USAGE
  $ exif-util COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`exif-util find-pairs PATH`](#exif-util-find-pairs-path)
* [`exif-util help [COMMAND]`](#exif-util-help-command)
* [`exif-util scan-dir`](#exif-util-scan-dir)
* [`exif-util scan-file`](#exif-util-scan-file)
* [`exif-util shuffle-dir [FILE]`](#exif-util-shuffle-dir-file)

## `exif-util find-pairs PATH`

Find pairs in a directory of images based on EXIF tags

```
USAGE
  $ exif-util find-pairs PATH

ARGUMENTS
  PATH  Path to directory to look for pairs

OPTIONS
  -h, --help                               show CLI help
  --export                                 Enable export of image pairs list
  --exportAs=json                          Set export format. Currently supported: [json]
  --matchingMode=pattern                   (required) Choose method for finding pairs
  --patternRGB=patternRGB                  Pattern to look for in a RGB image
  --patternRadiometric=patternRadiometric  Pattern to look for in a Radiometric image
  --startsWith=RGB|Radiometric             Specify which image comes first
```

_See code: [src/commands/find-pairs.ts](https://github.com/kbd-overlord/exif-util/blob/v0.0.4-alpha/src/commands/find-pairs.ts)_

## `exif-util help [COMMAND]`

display help for exif-util

```
USAGE
  $ exif-util help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.12/src/commands/help.ts)_

## `exif-util scan-dir`

Scan a directory with images images

```
USAGE
  $ exif-util scan-dir

OPTIONS
  -h, --help             show CLI help
  --directory=directory  Path to directory
  --export               Enable export of scan report and comparison
  --exportAs=json        Set export format. Currently supported: [json]
```

_See code: [src/commands/scan-dir.ts](https://github.com/kbd-overlord/exif-util/blob/v0.0.4-alpha/src/commands/scan-dir.ts)_

## `exif-util scan-file`

describe the command here

```
USAGE
  $ exif-util scan-file

OPTIONS
  -h, --help       show CLI help
  --export         Enable export of image exif tags
  --exportAs=json  Set export format. Currently supported: [json]
  --file=file      Path to file
```

_See code: [src/commands/scan-file.ts](https://github.com/kbd-overlord/exif-util/blob/v0.0.4-alpha/src/commands/scan-file.ts)_

## `exif-util shuffle-dir [FILE]`

describe the command here

```
USAGE
  $ exif-util shuffle-dir [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/shuffle-dir.ts](https://github.com/kbd-overlord/exif-util/blob/v0.0.4-alpha/src/commands/shuffle-dir.ts)_
<!-- commandsstop -->
