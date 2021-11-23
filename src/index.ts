#!/usr/bin/env node
import { createWebsite } from "./composer";
import { getFileConfig, getArgConfig } from "./config";

const config = { ...getFileConfig(), ...getArgConfig() };

console.log(config);

createWebsite();
