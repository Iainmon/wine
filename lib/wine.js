const fs = require('fs');
const winetxt =
    `\x1b[31m
,--.   ,--. ,--.
|  |   |  | \`--' ,--,--,   ,---.
|  |.'.|  | ,--. |      \\ | .-. :
|   ,'.   | |  | |  ||  | \\   --.
'--'   '--' \`--' \`--''--'  \`----'
\x1b[0m`;

const defaultJSON = {
    wine : {
        printCommands : true,
        wineryfile : './winery.js',
        usingwinepackage : 'none'
    }
};

var Commands = {

};


class Wine {
    constructor() {
        console.log('🍷');
        this.imports = {};
        this.boot();
        this.integrity = Wine.integrityCheck();
        if (!this.integrity) this.firstTime();
    }

    static errlog(str) {
        if (fs.existsSync('./wine.log')) {
            fs.appendFileSync('./wine.log', `\n${str}`);
        } else {
            fs.writeFileSync('./wine.log', `${str}`);
        }
    }

    static integrityCheck() {
        //Wine.sip('Running integrity check.');
        return ((fs.existsSync('./winery/winery.js') || fs.existsSync('./winery.js')) && fs.existsSync('./wine.json'));
    }


    static sip(str) { console.log( '\x1b[31m🍇 ' + str + '\x1b[0m' ); return str }

    static landing() { console.log(winetxt); }

    parse(args) {
        if (!this.integrity) this.firstTime();
        switch (args[0]) {
            case '':
            case ' ':
            case undefined:

                Wine.landing();
                Wine.sip('Your wine setup is good! 🥂');

                break;

            case 'i':
            case 'install':
            case 'inst':
                this.install(args);
                break;

            case 'bottle':
                this.loadBottle(args);
                break;

            default:
                this.loadWinery(args);
        }
    }

    loadBottle(args) {
        if (!args[1]) return Wine.sip('Please specify a bottle.');
        try {
            try {
                this.imports.Bottle = require('./winery/bottles/' + args[1] + '.js');
            } catch (e) {
                Wine.sip('Cannot find the `' + args[1] + '` bottle.')
            }
            try {
                this.bottle = new this.imports.Bottle(args, Wine);
            } catch (e) {
                Wine.sip('There is something wrong with your bottle.');
            }

        } catch (e) {
            if (this.config.wine.printCommands) {
                console.log(e);
            }
            console.log('Your winery file or application threw an error. The error has been logged in your wine.log file.');
            Wine.errlog(e);
        }
    }

    loadWinery(args) {
        try {
            try {
                this.imports.Winery = require(this.config.wineryfile);
            } catch (e) {
                return Wine.sip('Your winery file could not be found. Please check your wine.json file.');
            }
            this.winery = new this.imports.Winery();
            let script = this.winery.action(args);

            if (!script) return Wine.sip('No script defined for that command!');

            Wine.sip(script.startText);

            Wine.sip('|---------- Opening Wine Box ----------|');

            try {
                script.run(args);
                Wine.sip('|---------- Closing Wine Box ----------|');
                Wine.sip('All done!');
            } catch (e) {
                Wine.sip('|---------- Closing Wine Box ----------|');
                Wine.sip('There was an error when spinning up your winery.');
            }

        } catch (e) {
            if (this.config.wine.printCommands) {
                console.log(e);
            }
            console.log('Your winery file or application threw an error. The error has been logged in your wine.log file.');
            Wine.errlog(e);
        }
    }

    static setFile(options) {
        if (!fs.existsSync(`./${options.file}`)) {
            fs.writeFileSync(`./${options.file}`, options.data);
            console.log(`Your ${options.file} has been created.`);
        } else {
            console.log(`Your ${options.file} already exists.`);
        }
    }

    run(command) {
        if (this.config.wine.printCommands) {
            Wine.sip('Showing results from `'+ command +'`');
            console.log(this.imports.cmd(command));
            Wine.sip('`'+ command +'` is done executing.');
            console.log('');
        } else {
            this.imports.cmd(command);
        }
    }

    firstTime() {

        Wine.landing();

        Wine.sip('Checking if you already have a package.json...');

        if (!fs.existsSync('./package.json')) throw 'Run `npm init`. You must have a package.json before you run wine.';

        Wine.sip('Checking your wine files...');

        Wine.setFile({
            file : 'wine.json',
            data : JSON.stringify(defaultJSON),
        });

        Wine.setFile({
            file : 'winery.js',
            data : 'class Winery {} \n module.exports = Winery;',
        });

        Wine.sip('Running `npm install` and `npm update`.');

        this.imports.cmd('npm install; npm update;');

        Wine.sip('Please configure your wine files, and then run `node wine init`.');

    }

    boot() {
        this.imports.cmd = require('child_process').execSync;
        try {
            this.config = require('./wine.json');
        } catch (e) {
            Wine.sip('Reading wine.json failed.');
            if (this.integrity) {
                this.firstTime();
            } else {
                Wine.sip('This requires a human to fix. ORIGIN: reading wine.json');
            }
        }
    }

    install(args) {
        let packageName = args[1];
        const delPackage = (pkgname) => this.imports.cmd(`npm remove ${pkgname}`);
        const failanddelete = (str) => {
            Wine.sip('Removing package...');
            try {
                delPackage(packageName);
            } catch (e) {
                Wine.sip('Operation failed! Please remove the package manually.');
            }
            return Wine.sip(str);
        };

        if (packageName === undefined) return Wine.sip('Please specify a package.');
        try {
            Wine.sip(`Installing ${packageName}...`);
            this.imports.cmd(`npm install ${packageName}`);
        } catch (e) {
            return Wine.sip('Could not run `npm install`');
        }
        if (!fs.existsSync(`./node_modules/${packageName}/wine.json`)) return failanddelete('This is package has no wine.json!');

        let packageConfig;
        try {
            packageConfig = require(`./node_modules/${packageName}/wine.json`);
        } catch (e) {
            return failanddelete('The package config is not configured correctly.');
        }

        if (!!!packageConfig.wine.grapeseedsfile) return failanddelete('This package has a wine.json but no grape-seeds.json file.');
        if (!(fs.existsSync(`./node_modules/${packageName}/${packageConfig.wine.grapeseedsfile}`) || fs.existsSync(`./node_modules/${packageName}/grape-seeds.json`))) return failanddelete('This package is not a wine package.');

        let grapeseedsConfig;
        try {
            try {
                grapeseedsConfig = require(`./node_modules/${packageName}/${packageConfig.wine.grapeseedsfile}`);
            } catch (e) {
                grapeseedsConfig = require(`./node_modules/${packageName}/grape-seeds.json`);
            }
        } catch (e) {
            return failanddelete(`There was an error trying to import the package's grape-seeds.json.`);
        }
        if (!!!grapeseedsConfig.copypath) return failanddelete('Winery folder not found for module.');
        try {
            this.imports.cmd(`cp -a node_modules/${packageName}/${grapeseedsConfig.copypath}/. winery`);
        } catch (e) {
            return failanddelete('Could not copy winery folder to current directory.');
        }

        Wine.sip(`The installation of ${packageName} was successful!`);
        Wine.sip(`Read the README.md file for ${packageName} before you use it.`);
    }
}

const args = process.argv.slice(2);
let wine = new Wine();
wine.parse(args);