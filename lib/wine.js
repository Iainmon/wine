const fs = require('fs');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const Winelib = require('./winelib.js');
const Winery = require('./winery.js');
const defaults = require('./defaults.js');

const defaultJSON = {
    wine : {
        printCommands : true,
        winery : {
            wineryfile : './winery.js'
        }
    }
};

class Wine {
    constructor() {
        console.log('🍷');
        this.imports = {};
        this.boot();
    }

    parse(args) {

        switch (args[0]) {
            case '':
            case ' ':
            case undefined:

                Winelib.landing();
                Winelib.sip('Your wine setup is good! 🥂');

                break;

            case 'i':
            case 'install':
            case 'inst':
                this.install(args);
                break;

            case 'plant':
                this.plant();
                break;


            default:
                this.winery = new Winery({
                    config : this.config,
                    args : args
                });
        }
    }

    firstTime() {

        Winelib.landing();

        Winelib.sip('Checking if you already have a package.json...');

        if (!fs.existsSync('./package.json')) throw 'Run `npm init`. You must have a package.json before you run wine.';

        Winelib.sip('Checking your wine files...');

        Winelib.setFile({
            file : 'wine.json',
            data : JSON.stringify(defaults.defaultWineFileJSON, null, 2),
        });

        Winelib.setFile({
            file : 'winery.js',
            data : defaults.defaultWinery,
        });

        Winelib.sip('Running `npm install` and `npm update`.');

        Winelib.run('npm install grapejuice; npm install; npm update;');

        Winelib.sip('Please configure your wine files.');

    }

    boot() {
        this.integrity = Winelib.integrityCheck();
        this.imports.cmd = require('child_process').execSync;
        try {
            this.config = Winelib.readJson('./wine.json');
        } catch (e) {
            Winelib.sip('Reading wine.json failed.');
            this.firstTime();
            this.boot();
        }
    }

    install(args) {
        let WineInstaller = require('./wineinstaller.js');
        let installer = new WineInstaller({
            args : args,
            config : this.config
        });
    }

    plant() {
        let Grapeseeds = require('./Grapeseeds.js');
        let planter = new Grapeseeds({
            config : this.config
        });
    }
}

module.exports = Wine;