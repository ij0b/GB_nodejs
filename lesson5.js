#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require("fs");
const path = require("path");
const cluster = require('cluster');
const os = require('os');
const yargs = require("yargs");
const inquirer = require("inquirer");

let startDir = process.cwd();
let currentDir = startDir;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running...`);

    for (let i = 0; i < os.cpus().length; i++) {
        console.log(`Forking process number ${i}`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} is running...`);
    const pathResource = path.join(__dirname, 'lesson5.html');

    const server = http.createServer(((req, res) => {
        setTimeout(() => {
            console.log(`Worker ${process.pid} handling request`);
            res.writeHead(200, 'OK', {
                'Content-Type': 'text/html; charset=utf-8',
            });
            currentDir = req.url;
            if (req.url === '/') {
                contentCurrentDir = fs.readdirSync(startDir);
                for (let i = 0; i < contentCurrentDir.length; i++) {
                    res.write('<div><a href="' + contentCurrentDir[i] + '" >' + path.join(startDir, contentCurrentDir[i]) + '</a></div>');
                }
            } else {
                let urlEnd = req.url.match(/[^/]+$/g);
                let pathResource = req.url;
                if (urlEnd[0].match(/[^.]+\.[^.]+/g)) {
                    fs.stat(pathResource.replace(/^\//g, ''), function (err) {
                        if (!err) {
                            res.write('<h2>Содержимое файла:</h2>');
                            fs.readFile(pathResource.replace(/^\//g, ''), 'utf8', (err, data) => {
                                res.write(data);
                            });
                            console.log('File found');
                        } else {
                            console.log('File not found');
                            res.write('<h2>File not found</h2>');
                        }
                    });
                } else {
                    fs.stat(pathResource.replace(/^\//g, ''), function (err) {
                        if (!err) {
                            let prevDir = currentDir.replace(/\/[^\/]+$/g, '');
                            currentDir = path.join(startDir, pathResource);
                            if (!prevDir) {
                                prevDir = '.';
                            }
                            res.write('<div><a href="' + prevDir + '">^ ' + prevDir + '</a></div>');
                            contentCurrentDir = fs.readdirSync(currentDir);
                            for (let i = 0; i < contentCurrentDir.length; i++) {
                                res.write('<div><a href="' + path.join(pathResource, contentCurrentDir[i]) + '" >' + path.join(prevDir, contentCurrentDir[i]) + '</a></div>');
                            }
                            console.log('Directory found');
                        } else {
                            res.write('<h2>Directory not found</h2>');
                            console.log('Directory not found');
                        }
                    });
                }
            }
        }, 1000);
    }));
    server.listen(5555);
}