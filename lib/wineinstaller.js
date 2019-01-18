const Winelib = require('./Winelib.js');
const fs = require('fs');

class WineInstaller {

    constructor(options) {
        this.args = options.args;
        this.packageName = this.args[1];
        this.config = options.config;
        this.install();
    }

    install() {
        const delPackage = (pkgname) => Winelib.run(`npm remove ${pkgname}`);
        const failanddelete = (str) => {
            Winelib.sip('Removing package...');
            try {
                delPackage(this.packageName);
            } catch (e) {
                Winelib.sip('Operation failed! Please remove the package manually.');
            }
            return Winelib.sip(str);
        };

        if (this.packageName === undefined) return Winelib.sip('Please specify a package.');
        try {
            Winelib.sip(`Installing ${this.packageName}...`);
            Winelib.run(`npm install ${this.packageName}`);
        } catch (e) {
            return Winelib.sip('Could not run `npm install`');
        }
        if (!fs.existsSync(`./node_modules/${this.packageName}/wine.json`)) return failanddelete('This is package has no wine.json!');

        try {
            this.packageConfig = Winelib.readJson(`node_modules/${this.packageName}/wine.json`);
        } catch (e) {
            return failanddelete(`The package's wine.json config is not configured correctly.`);
        }

        if (Winelib.askYN('Would you like wine to automatically configure your wine.json to support the installed package?')) this.configureWinefile();

    }

    configureWinefile() {

        if (!!this.config.package) if (!!this.config.package.name && this.config.package.name != '') {
                Winelib.sip(`It looks like you already have a package '${this.config.package.name}' set in your wine.json.`);
                if (!Winelib.askYN('Would you like to over write it?')) return Winelib.sip('Ok. Please configure your wine.json manually.');
            }

        this.config.wine.package = {
            name : this.packageName,
        };
        delete this.config.wine.winery;

        Winelib.setFile({
            file : 'wine.json',
            data : JSON.stringify(this.config, null, 2),
            override : true
        });

        Winelib.sip(`The installation of ${this.packageName} was successful!`);
        Winelib.sip(`Read the README.md file for ${this.packageName} before you use it.`);
    }

}

module.exports = WineInstaller;