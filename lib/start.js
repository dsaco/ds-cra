'use strict';
const fs = require('fs');

const { program } = require('commander');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');

const packageJson = require('../package.json');
const { cSimple, cEslint, cAntd } = require('./createProj');

let projectName;

program
	.name(chalk.yellow(packageJson.name))
	.description('create a react app into a newly created directory')
	.version(packageJson.version)
	.arguments('[project-directory]')
	.usage(
		`${chalk.green('<project-directory>')} ${chalk.magenta('[options]')}`
	)
	.action((name) => {
		projectName = name;
	})
	.option(
		'-s, --simple',
		`${chalk.magenta('快速模式')}${chalk.gray('(默认)')}`
	)
	.option('-e, --eslint', `${chalk.magenta('严格代码')}`)
	.option('-a, --antd', `${chalk.magenta('Ant Design')}`)
	.parse(process.argv);

if (typeof projectName === 'undefined') {
	console.log(`
请指定项目目录:
    ${chalk.yellow(packageJson.name)} ${chalk.green('<project-directory>')}

更多详情请输入:
    ${chalk.yellow(packageJson.name)} ${chalk.green('--help')}
    `);
	process.exit(1);
}

checkAppName(projectName);

createApp();

function checkAppName(appName) {
	const result = validateProjectName(appName);
	if (!result.validForNewPackages) {
		console.error(`
不能创建名为 ${chalk.red(`"${projectName}"`)} 的项目.
        `);
		[...(result.errors || []), ...(result.warnings || [])].forEach(
			(error) => {
				console.log(`${chalk.red('*')} ${error}`);
			}
		);
		process.exit(1);
	}
}

function printSuccess(appName) {
	console.log(`
    ${chalk.cyan('创建成功')}

    cd ${chalk.green(appName)} && npm i

    npm start
            
    `);
}

async function createApp() {
	const ok = await new Promise((resolve) => {
		fs.access(projectName, fs.constants.F_OK, (error) => {
			if (error) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
	if (ok) {
		if (program.antd) {
			await cAntd(projectName);
		} else if (program.eslint) {
			await cEslint(projectName);
		} else {
			await cSimple(projectName);
		}
		printSuccess(projectName);
	} else {
		console.error(`
${chalk.red(`"${projectName}"`)} 项目已存在.
            `);
		process.exit(1);
	}
}
