const fs = require('fs');
const path = require('path');
const helpObj = require('./commands/help');
const treeObj = require('./commands/tree');
const organizeObj = require('./commands/organize');

let inputArr = process.argv.slice(2);
let command = inputArr[0];

switch(command){
    case 'tree':
        treeObj.treeFnKey(inputArr[0]);
        break;
    case 'organize':
        organizeObj.organizeFnKey(inputArr[1]);
        break;
    case 'help':
        helpObj.helpFnKey();
        break;
    default:
        console.log("Please enter a valid command ");
        break;
}