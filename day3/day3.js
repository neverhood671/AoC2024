const fs = require('fs');

function readStringFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
}

function solvePart1(input) {
    // regexp that matches all occurrences of the pattern mul(x,y) where x and y are numbers
    const regexp = /mul\((\d+),(\d+)\)/g;
    return [...input.matchAll(regexp)].reduce((acc, curr) => {
        const x = parseInt(curr[1]);
        const y = parseInt(curr[2]);
        return acc + x * y;
    }, 0);
}


const getNextInstruction = (str) => {
    const regexp = /mul\((\d+),(\d+)\)/;
    return str.match(regexp)
}

const getRes = (str, lastClosestModifier, acc) => {
    const doIt = 'do()',
        doNotDoIt = "don't()";

    const nextInstruction = getNextInstruction(str);

    if (nextInstruction) {

        const doItIndex = str.indexOf(doIt),
            doNotDoItIndex = str.indexOf(doNotDoIt),
            nextInstructionIndex = str.indexOf(nextInstruction[0]);

        if ((doItIndex === -1 && doNotDoItIndex === -1)
            || (doItIndex > - 1 && doNotDoItIndex > -1 && nextInstructionIndex < doItIndex && nextInstructionIndex < doNotDoItIndex)
            || (doItIndex > - 1 && doNotDoItIndex === -1 && nextInstructionIndex < doItIndex)
            || (doItIndex === -1 && doNotDoItIndex > -1 && nextInstructionIndex < doNotDoItIndex)) {
            if (lastClosestModifier !== doNotDoIt) {
                const [_, x, y] = nextInstruction
                acc += x * y
            }

            return getRes(
                str.substring(nextInstructionIndex + nextInstruction[0].length),
                lastClosestModifier,
                acc);

        } else {
            const isDo = (doItIndex > -1 && doNotDoItIndex > -1 && doItIndex < doNotDoItIndex)
                || (doItIndex > -1 && doNotDoItIndex === -1)
            const startIndex = isDo
                ? doItIndex + doIt.length
                : doNotDoItIndex + doNotDoIt.length;


            return getRes(
                str.substring(startIndex),
                isDo ? doIt : doNotDoIt,
                acc);
        }
    }

    return acc;
}


function solvePart2(input) {
    return getRes(input, null, 0)
}

console.log(solvePart2(readStringFromFile('./input.txt')));