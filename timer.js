//1++ Решение 1 задачи ДЗ: Record 1, Record 5, Record 6, Record 2, Record 3, Record 4
//2++ Формат даты YYYY-MM-DDThh:mm:ss. Пример запуска программы: node timer.js 2022-11-01T11:01:11 2023-12-02T22:02:12
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

console.log('Решение 1 задачи ДЗ: Record 1, Record 5, Record 6, Record 2, Record 3, Record 4');

class Handler {
    static newRenderingCountdownCounter(inputDate) {
        let currentDate = moment();
        if (moment(inputDate).isBefore(moment())) {
            console.log(`Счетчик обратного отсчета стартовавший ${moment(inputDate).format('YYYY-MM-DD,hh:mm:ss')} завершен.`.bgGreen.black);
            return;
        }

        let years = inputDate.diff(currentDate, 'year');
        currentDate.add(years, 'years');

        let months = inputDate.diff(currentDate, 'months');
        currentDate.add(months, 'months');

        let days = inputDate.diff(currentDate, 'days');
        currentDate.add(days, 'days');

        let hours = inputDate.diff(currentDate, 'hours');
        currentDate.add(hours, 'hours');

        let minutes = inputDate.diff(currentDate, 'minutes');
        currentDate.add(minutes, 'minutes');

        let seconds = inputDate.diff(currentDate, 'seconds');
        currentDate.add(seconds, 'seconds');

        console.log(colors[currentColorOutput](years + ' years ' + months + ' months ' + days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds'));

        setTimeout(() => {
            Handler.newRenderingCountdownCounter(inputDate);
        }, intervalTime);
    }
}

const EventEmitter = require('events');
let moment = require('moment');
const colors = require("colors");
const args = process.argv.slice(2);
const arrDates = [];
const intervalTime = 1000;
let inputDate;
let noError = true;
let currentColorOutput = 'green';

function error() {
    noError = false;
    break;
}

for (let i = 0; i < args.length; i++) {
    inputDate = moment(args[i]);
    if (!inputDate.isValid()) {
        console.log(colors['red']('Ошибка ввода. Формат даты YYYY-MM-DDThh:mm:ss. Пример: 2022-10-01T11:01:11'));
        error();
    } else if (moment(inputDate).isBefore(moment())) {
        console.log(colors['red']('Ошибка ввода. Введенная дата уже прошла'));
        error();
    } else {
        arrDates.push(inputDate);
    }
}

if (noError) {
    class emitter extends EventEmitter { };
    const emitterObj = new emitter;
    emitterObj.on('newRenderingCountdownCounter', Handler.newRenderingCountdownCounter);

    setInterval(() => {
        if (currentColorOutput == 'green') {
            currentColorOutput = 'yellow';
        } else {
            currentColorOutput = 'green';
        }
    }, intervalTime);

    for (let i = 0; i < arrDates.length; i++) {
        emitterObj.emit('newRenderingCountdownCounter', arrDates[i]);
    }
}