# Blankpage - an easy static text content generator.

## Installation

Install globally

```bash
npm install -g blankpage
```

Install locally

```bash
npm install blankpage
```

## Usage

#### Basic usage involves invoking the `blankpage` command with a specified configuration file.

You can launch it from your terminal if globally installed:

```bash
$ blankpage website.json
```

Add to your `package.json` as an npm script:

```json
"scripts": {
  "start": "blankpage website.json"
}
```

Use `npx` to run when locally installed:

```bash
$ npx blankpage website.json
```

## Configuration

`website.json` - The configuration file, which holds the settings of the package.

Example:

```json
{
  "title": "Website.com",
  "header": "Neat website",
  "subheader": "Javascript junkie.",
  "input": "InputDirectoryWithTextFiles",
  "inputType": "fs|git",
  "output": "OutDirForHTMLFile",
  "filename": "HTMLFileName"
}
```

Configuration options:

| Key         | Value                                                                                                                                                         | Default Value |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `title`     | The `<title>` of the generated index file                                                                                                                     | `""`          |
| `header`    | The header of the website                                                                                                                                     | `""`          |
| `subheader` | The subheader of the website                                                                                                                                  | `""`          |
| `input`     | The input directory, where the text files are located                                                                                                         | `txt`         |
| `inputType` | Sorting type for the files:<br> `fs` will sort by name, for example: a > b > c.<br>`git` will sort by the order in which files were added to version control. | `fs`          |
| `output`    | The output directory, where the index file will be generated.                                                                                                 | `dist`        |
| `filename`  | The name of the index file.                                                                                                                                   | `index.html`  |
