#!/usr/bin/env node

'use strict';

var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var packagejson = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString());

var argv = require('yargs')
    .usage('Usage: sns [options]')
    .help('h')
    .describe('v', 'Vocal, show description of task')
    .alias('v', 'vocal')
    .alias('h', 'help')
    .epilogue('Happy running! Made by DKunin http://dkunin.github.io/').argv;
 
console.log('Project: ' + packagejson.name);
console.log('Description: ' + packagejson.description);

inquirer.prompt([
  {
    type: 'list',
    name: 'script',
    message: 'Choose script to run',
    choices: Object.keys(packagejson.scripts).map(function(singleKey){
        if(argv.v) {
            return singleKey + ': ' + packagejson.scripts[singleKey];
        }
        return singleKey;
    })
    
  }
], function( answers ) {
    var command = ' npm run ' + answers.script;
    console.log( 'gonna run : ' +  command );
    shell.exec(command);
});