let Wine = require('./index.js').Wine;
let wine = new Wine();
wine.parse(process.argv.slice(2));
