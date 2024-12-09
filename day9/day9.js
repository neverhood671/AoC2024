const fs = require('fs');

const DEBUG = true;
function readStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
}

const getCheckSumOfFragment = (repetitions, id, index) => {
    let res = 0;

    for (let i = 0; i < repetitions; i++) {
        res += id * (index + i);
    }

    return res;
}


const solvePart1 = (input) => {

    const initial = input.split('').map((curr, i) => {
        if (i % 2 === 0) {
            const res = [];
            for (let j = 0; j < parseInt(curr); j++) {
                res.push(`${i / 2}`);
            }
            return res
        }
        return '.'.repeat(parseInt(curr)).split('');
    }).flat();

    let pointer = initial.length - 1

    while (initial.includes('.')) {
        const firstEmptyIndex = initial.indexOf('.');

        if (initial[pointer] === '.') {
            initial[pointer] = undefined
            pointer--;
            continue;
        } 

        initial[firstEmptyIndex] = initial[pointer];
        initial[pointer] = undefined;
        pointer--;
    }

    
    return initial.filter(x => x).reduce((acc, curr, i) => acc + parseInt(curr)*i, 0)
}


console.log(solvePart1(readStringsFromFile('./input.txt')));