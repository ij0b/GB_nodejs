function primesOutput(minNumber, maxNumber) {
    let saveMinNumber = minNumber;
    if (minNumber < 2) {
        minNumber = 2;
    }
    let arColors = ['green', 'yellow', 'red'];
    let idCurrentColor = 0;
    let noPrimeNumbers = true;
    const colors = require("colors/safe");

    nextPrime:
    for (let i = minNumber; i <= maxNumber; i++) {
        for (let j = 2; j < i; j++) {
            if (i % j == 0) continue nextPrime;
        }
        noPrimeNumbers = false;
        console.log(colors[`${arColors[idCurrentColor]}`](i));

        if (idCurrentColor < 2) {
            idCurrentColor++;
        } else {
            idCurrentColor = 0;
        }
    }
    if (noPrimeNumbers) {
        console.log('В диапазоне (', saveMinNumber, ',', maxNumber, ') нет простых чисел');
    }
}

const args = process.argv.slice(2);
let [minNumber, maxNumber] = args;

if (isNaN(minNumber) || isNaN(maxNumber)) {
    console.log('Аргументы функции должны быть положительными числами');
} else {
    minNumber = +minNumber;
    maxNumber = +maxNumber;
    primesOutput(minNumber, maxNumber);
}