const fs = require('fs');
const Winelib = require('./winelib.js');

class Grapeseeds {
    constructor(options) {
        this.config = options.config;
        this.plant();
    }

    plant() {
        let exportingPackageName = this.config.wine.package.name;

        if ((!exportingPackageName) || exportingPackageName === 'none') return Winelib.sip('It please install a wine package, and declare it in your wine.json.');
        let packageConfig;
        try {
            packageConfig = Winelib.readJson(`node_modules/${exportingPackageName}/wine.json`);
        } catch (e) {
            return Winelib.sip(`Could not load ${exportingPackageName}'s wine.json.`);
        }

        if (!Winelib.askYN(`Exporting from '${exportingPackageName}' will overwrite your wineryfile and winery folder (if it exists). Continue?`)) return Winelib.sip('Aborted!');

        if (!!!packageConfig.wine.grapeseedsconfig) return Winelib.sip('This package has a wine.json but no grape-seeds.json file.');
        if (!(fs.existsSync(`./node_modules/${exportingPackageName}/${packageConfig.wine.grapeseedsconfig}`) || fs.existsSync(`./node_modules/${exportingPackageName}/grape-seeds.json`))) return Winelib.sip('This package is not a wine package.');

        let grapeseedsConfig;
        try {
            try {
                grapeseedsConfig = Winelib.readJson(`./node_modules/${exportingPackageName}/${packageConfig.wine.grapeseedsconfig}`);
            } catch (e) {
                grapeseedsConfig = Winelib.readJson(`./node_modules/${exportingPackageName}/grape-seeds.json`);
            }
        } catch (e) {
            return Winelib.sip(`There was an error trying to import the package's grape-seeds.json.`);
        }
        if (!!!grapeseedsConfig.copypath) return Winelib.sip('Winery folder not found for module.');
        try {
            Winelib.run(`cp -r ./node_modules/${exportingPackageName}/${grapeseedsConfig.copypath}/. winery`);
        } catch (e) {
            return Winelib.sip('Could not copy winery folder to current directory.');
        }

        Winelib.sip('Successfully planted the grape seeds!');
        if (Winelib.askYN('Would you like to manually update your wine.json?')) return Winelib.sip('Please change your wine.json to use the exported winery folder.');

        this.config.wine.winery.wineryfile = './winery/winery.js';
        Winelib.setFile({
            file : 'wine.json',
            data : JSON.stringify(this.config, null, 2),
            override : true
        });

        if (fs.existsSync('./winery.js')) return Winelib.sip('Your winery.js is no longer in use. You may remove it.');
    }
}

module.exports = Grapeseeds;