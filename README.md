# Wine

A way tool to help you create environments for individual projects for testing and deployment.

# Installation

* `$ npm install grapejuice`
* `$ cp ./node_modules/grapejuice/wine wine`
* Add `alias wine="node wine"` to your bash profile. (optional)
* `$ wine`

See https://grape-juice.org for wine package installation instructions.

# About

If you are bulding a package, please see the wine package guide

https://grape-juice.org/guides/creating-packages/

#### Wine

##### - Files
* `wine.json` - This is where you tell wine where your winery file is, or which wine package you are using.
* `wineryfile` - This is where you define all of the commands for your wine environment. `default: winery.js`

##### - Commands
* `inst <packagename>` - This will install a wine package that has been published to npm.

#### Packages
* `vinefile`
* `grapeseeds`