const fs = require('fs');

function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

function isSafe(arr) {
    let isSafe = true;
    let trend = 0;

    for (let i = 1; i < arr.length; i++) {
        const diff = arr[i] - arr[i - 1];
        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
            isSafe = false;
            break;
        }

        const newTrend = diff < 0 ? -1 : 1;

        if (trend !== 0 && newTrend !== trend) {
            isSafe = false;
            break;
        }

        trend = newTrend;
    }

    return isSafe;
}

function solvePart1(input) {
    return input.reduce((acc, curr) => {
        const isCurrSafe = isSafe(curr.split(' ').map(Number));
        return isCurrSafe ? acc + 1 : acc;
    }, 0);
}

function solvePart2(input) {
    return input.reduce((acc, curr) => {
        const currArray = curr.split(' ').map(Number);
        let isCurrSafe = isSafe(currArray);
        if (isCurrSafe) return acc + 1;

        let isHypotheticallySafe = false;

        for (let i = 0; i < currArray.length; i++) {
            const hypotheticallySafeArray = [...currArray];
            hypotheticallySafeArray.splice(i, 1);

            isHypotheticallySafe = isSafe(hypotheticallySafeArray);
            if (isHypotheticallySafe) break;
        }
        return isHypotheticallySafe ? acc + 1 : acc;
    }, 0);
}

console.log(solvePart2(readAllStringsFromFile('./input.txt')));

