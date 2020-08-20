#!/usr/bin/env node

'use strict';

const chalk = require('chalk');

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 8) {
    console.error(
        chalk.red(
            `
当前Node版本为 ${currentNodeVersion}

创建项目需要Node8或以上.
请升级你的Node.
            `
        )
    );
    process.exit(1);
}

require('./lib/start');
