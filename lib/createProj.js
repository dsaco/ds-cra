const fs = require('fs');
const _fs = require('fs-extra');
const downloadGitRepo = require('download-git-repo');
const chalk = require('chalk');

const cSimple = async (projectName) => {
	await _fs.ensureDir(`${projectName}`);
	await download('dsaco/react-templates', projectName);
	await replacePkgName(`${projectName}/package.json`, projectName);
};
const cEslint = async (projectName) => {
	await _fs.ensureDir(`${projectName}`);
	await download('dsaco/react-templates#eslint', projectName);
	await replacePkgName(`${projectName}/package.json`, projectName);
};
const cAntd = async (projectName) => {
	await _fs.ensureDir(`${projectName}`);
	await download('dsaco/react-templates#antd', projectName);
	await replacePkgName(`${projectName}/package.json`, projectName);
};

module.exports = {
	cSimple,
	cEslint,
	cAntd,
};

async function replacePkgName(path, projectName) {
	const content = await fs.readFileSync(path, 'utf-8');
	await fs.writeFileSync(
		path,
		content.replace('react-templates', projectName),
		'utf-8'
	);
}
function download(url, dest) {
	return new Promise((resolve) => {
		downloadGitRepo(url, dest, (err) => {
			if (err) {
				console.error(`
${chalk.red(`Error:`)} ${err.message}
                `);
			} else {
				resolve();
			}
		});
	});
}
