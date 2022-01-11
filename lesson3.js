const fs = require('fs');
const { Transform } = require('stream');

const readStream = new fs.ReadStream('./logs/access-test.log', {
    encoding: 'utf8',
    highWaterMark: 64 * 4
});
const writeStreamIp1 = fs.createWriteStream('./logs/%89.123.1.41%_requests.log', {
    encoding: 'utf8'
});
const writeStreamIp2 = fs.createWriteStream('./logs/%34.48.240.111%_requests.log', 'utf8');

let prevEndChunk;
let endChunk;
let transformedChunk = '';
let endFile = false;

function appendRecord(arIpLogs1, arIpLogs2) {
    if (arIpLogs1) {
        for (let i = 0; i < arIpLogs1.length; i++) {
            transformedChunk += arIpLogs1[i];
        }
        writeStreamIp1.write(transformedChunk);
        transformedChunk = '';
    }
    if (arIpLogs2) {
        for (let i = 0; i < arIpLogs2.length; i++) {
            transformedChunk += arIpLogs2[i];
        }
        writeStreamIp2.write(transformedChunk);
    }
}

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        transformedChunk = '';

        if (prevEndChunk) {
            let arIpLogs1 = (prevEndChunk + chunk.toString()).match(/.*89\.123\.1\.41.*\n/g);
            let arIpLogs2 = (prevEndChunk + chunk.toString()).match(/.*34\.48\.240\.111.*\n/g);

            appendRecord(arIpLogs1, arIpLogs2);

            if (chunk.toString().match(/(?:\n).*$/g)) {
                prevEndChunk = chunk.toString().match(/(?:\n).*$/g).toString();
            } else {
                prevEndChunk = chunk.toString();
                endFile = true;
            }
        } else {
            prevEndChunk = chunk.toString();
        }

        if (endFile) {
            endChunk += prevEndChunk;
        } else {
            endChunk = chunk.toString();
        }

        //1+++ Такой способ для больших файлов не подходит?
        // fs.writeFile('./logs/access-test2.log', transformedChunk, { flag: 'a' }, (err) => console.log(err));
        //1--- Такой способ для больших файлов не подходит?

        callback();
    },

    flush() {
        let arIpLogs1 = endChunk.match(/.*89\.123\.1\.41.*(\n|$)/g);
        let arIpLogs2 = endChunk.match(/.*34\.48\.240\.111.*(\n|$)/g);

        appendRecord(arIpLogs1, arIpLogs2);
    }
});

readStream.pipe(transformStream);