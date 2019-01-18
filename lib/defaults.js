let defaults = {};
defaults.defaultWineFileJSON = {
    wine : {
        printCommands : true,
        winery : {
            wineryfile : './winery.js'
        }
    }
};

defaults.defaultWinery =
`class Winery {
    constructor() {
        this.scripts = {};
    }
    action(args) {}
}
module.exports = Winery;`;
module.exports = defaults;