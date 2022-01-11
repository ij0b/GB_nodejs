#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const inquirer = require("inquirer");

const options = yargs
    .usage("Usage: -p <path>")
    .option("p", { alias: "path", describe: "Path to file", type: "string", demandOption: false })
    .argv;

let currentDirectory = process.cwd();
if (options.p) {
    currentDirectory = options.p;
}
const isFile = fileName => {
    return fs.lstatSync(path.join(currentDirectory, fileName)).isFile();
}

let list = fs.readdirSync(currentDirectory);
list.unshift('< PREV DIR');

function outputList() {
    inquirer
        .prompt([
            {
                name: "fileOrDirName",
                type: "list",
                message: "Choose file or dir:",
                choices: list,
            },
        ])
        .then((answer) => {
            let filePath;
            if (list[0] == answer.fileOrDirName) {
                filePath = path.join(currentDirectory, '..');
            } else {
                filePath = path.join(currentDirectory, answer.fileOrDirName);
                if (fs.lstatSync(filePath).isFile()) {
                    inquirer
                        .prompt([
                            {
                                name: "pattern",
                                type: "input",
                                message: "Enter the search string, if not - press enter:"
                            },
                        ])
                        .then((answer) => {
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (answer.pattern != '') {
                                    let regPattern = new RegExp(answer.pattern, 'gi')
                                    if (data.match(regPattern)) {
                                        console.log('Number of line matches - ', data.match(regPattern).length);
                                    } else {
                                        console.log(data);
                                    }
                                } else {
                                    console.log(data);
                                }
                            });
                        })
                    return false;
                }
            }
            currentDirectory = filePath;
            list = fs.readdirSync(currentDirectory);
            list.unshift('< PREV DIR');
            outputList();
        });
}
outputList();