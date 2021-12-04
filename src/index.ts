#!/usr/bin/env node
import { createWebsite } from "./composer";
import { getConfig } from "./config";

const config = getConfig();

console.log(config);

createWebsite();
