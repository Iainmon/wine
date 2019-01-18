const Winelib = require('./winelib.js');

class Winery {
    constructor(options) {
        this.config = options.config;
        this.args = options.args;
        if (this.loadWinery()) this.bootWinery();
    }

    loadWinery() {
        try {
            if (!!this.config.wine.package) {
                let wineryConfig = Winelib.readJson(`./node_modules/${this.config.wine.package.name}/wine.json`);
                try {
                    this.LoadedWinery = Winelib.require(`${wineryConfig.winery.wineryfile}`);
                } catch (e) {
                    return Winelib.sip(`The package ${this.config.wine.package.name}'s winery.json could not be loaded.`);
                }
            } else {
                try {
                    this.LoadedWinery = Winelib.require(`${this.config.wine.winery.wineryfile}`);
                } catch (e) {
                    return Winelib.sip(`Your winery file could not be loaded.`);
                }
            }
        } catch (e) {
            return Winelib.sip(`The wine.json could not be loaded.`);
        }
        return true;
    }

    bootWinery() {
        let script;
        try {
            this.winery = new this.LoadedWinery();
        } catch (e) {
            console.log(e);
            return Winelib.sip('The winery file threw an error when it was initialized.');
        }
        try {
            script = this.winery.action(args);
            if (!script) return Winelib.sip('No script defined for that command!');
            Winelib.sip(script.startText);
        } catch (e) {
            return Winelib.sip('No script was returned by your winery.');
        }
        try {
            script.run(args);
            Winelib.sip('Winery script completed.');
        } catch (e) {
            return Winelib.sip('There was an error when running the script returned by your winery.');
        }
    }
}

module.exports = Winery;