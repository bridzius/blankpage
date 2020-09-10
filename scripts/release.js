#!/bin/node
const manifest = require( "../package.json");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const process = require("process");
const rimraf = require("rimraf");

const VALID_UPDATE_TYPES = ['patch', 'minor', 'major'];

const update_type = process.argv.splice(2)[0];
if (!VALID_UPDATE_TYPES.includes(update_type)) {
  console.error(`Error: Invalid update type - should be one of ${VALID_UPDATE_TYPES}`);
  process.exit(1);
}

const rel_manifest = {
  name: manifest.name,
  description: manifest.description,
  version: manifest.version,
  dependencies: manifest.dependencies,
  main: 'index.js',
  bin: {blankpage: 'index.js'},
  repository: manifest.repository,
  author: manifest.author
}

rimraf.sync('dist/');

const typescript_out = child_process.execSync(`npx tsc`);
console.log(typescript_out.toString('utf8'));

const rel_manifest_path = path.resolve('dist/package.json');
fs.writeFileSync(rel_manifest_path, JSON.stringify(rel_manifest, null, 1));

const version_out = child_process.execSync(`npm version ${update_type}`);
console.log(version_out.toString('utf8'));
