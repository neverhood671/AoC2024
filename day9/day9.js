const fs = require('fs');

const DEBUG = true;
function readStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
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

    return initial.filter(x => x).reduce((acc, curr, i) => acc + parseInt(curr) * i, 0)
}


const getResultArr = (input) => input.map((curr, i) => {
    if (curr.fileId !== undefined) {
        const res = [];
        for (let j = 0; j < curr.length; j++) {
            res.push(`${curr.fileId}`);
        }
        return res
    }
    return '.'.repeat(curr.length).split('');
}).flat();


const solvePart2 = (input) => {
    const initial = input.split('').map((curr, i) => {
        if (i % 2 === 0) return ({ fileId: i / 2, length: parseInt(curr) });
        return ({ length: parseInt(curr) });
    });

    const numberOfFiles = Math.floor(initial.length / 2);

    const res = [...initial];

    for (let i = numberOfFiles; i > 0; i--) {

        const currFileIndex = res.findIndex(x => x && x.fileId === i)
        const currFile = res[currFileIndex];

        const emptySlotsIndexes = res.slice(0, currFileIndex).reduce((acc, curr, i) => {
            if (curr.fileId === undefined) acc.push(i);
            return acc
        }, []);

        let j = 0;

        while (j < emptySlotsIndexes.length) {

            if (res[emptySlotsIndexes[j]].length === currFile.length) {
                res[emptySlotsIndexes[j]] = { ...currFile };
                res[currFileIndex] = { length: currFile.length };
                break;
            }

            if (res[emptySlotsIndexes[j]].length > currFile.length) {
                res.splice(emptySlotsIndexes[j], 1, { ...currFile }, { length: res[emptySlotsIndexes[j]].length - currFile.length });
                res[currFileIndex + 1] = { length: currFile.length };
                break;
            }

            j++;
        }
    }


    return getResultArr(res.filter(x => x)).reduce((acc, curr, i) => {
        if (curr !== '.') acc += parseInt(curr) * i
        return acc;
    }, 0)
}


console.log(solvePart2(readStringsFromFile('./input.txt')));