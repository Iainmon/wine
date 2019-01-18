const chalk = require('chalk');
const fs = require('fs');
const shell = require('child_process').execSync;
const readlineSync = require('readline-sync');

let Winelib = {};
Winelib.winetxt =
    chalk.red(`
,--.   ,--. ,--.
|  |   |  | \`--' ,--,--,   ,---.
|  |.'.|  | ,--. |      \\ | .-. :
|   ,'.   | |  | |  ||  | \\   --.
'--'   '--' \`--' \`--''--'  \`----'
`);

Winelib.sip = function (str) { console.log(chalk.red(`🍇 ${str}`) ); return str };
Winelib.flagFile = (str) => console.log(chalk.blue(`FILE: ${str}`));

Winelib.landing = function () { console.log(Winelib.winetxt); };

Winelib.integrityCheck = function () {
    try {
        return fs.existsSync('./wine.json');
    } catch (e) {
        return false;
    }
};

Winelib.errlog = function (str) {
    if (fs.existsSync('./wine.log')) {
        fs.appendFileSync('./wine.log', `\n${str}`);
    } else {
        fs.writeFileSync('./wine.log', `${str}`);
    }
};

Winelib.setFile = function (options) {
    if (options.override === true) {
        fs.writeFileSync(`./${options.file}`, options.data);
        Winelib.flagFile(`Your ${options.file} has been created or updated.`);
        return
    }
    if (!fs.existsSync(`./${options.file}`)) {
        fs.writeFileSync(`./${options.file}`, options.data);
        Winelib.flagFile(`Your ${options.file} has been created.`);
    } else {
        Winelib.flagFile(`Your ${options.file} already exists.`);
    }
};

Winelib.run = function (command) {
    Winelib.sip(`Running '${command}'`); return shell(command);
};

Winelib.readJson = function (path) {
    return JSON.parse(fs.readFileSync(path));
};
Winelib.require = function (path) {
    return require(`${process.cwd()}/${path}`);
};
Winelib.askYN = function (str) {
    return readlineSync.keyInYN(chalk.red(`🍇 ${str}`));
};

module.exports = Winelib;