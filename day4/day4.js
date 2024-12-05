const fs = require('fs');

function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

const countWordsInString = (arr, word) => {
    let res = 0;

    for (let i = 0; i <= arr.length - word.length; i++) {
        const currArr = arr.slice(i, i + word.length);
        if (currArr.join('') === word) res++;
    }

    return res;
}

const getAllStrings = (input) => {
    const strings = input.reduce((acc, curr, i) => {
        acc.horizontal.push(curr.split(''));
        curr.split('').forEach((c, j) => {
            if (!acc.vertical[j]) acc.vertical[j] = [];
            acc.vertical[j][i] = curr[j]

            const currDiagonalLRIndex = curr.length + i - j,
                currDiagonalRLIndex = curr.length - j - i + input.length;

            if (!acc.diagonalLR[currDiagonalLRIndex]) acc.diagonalLR[currDiagonalLRIndex] = [];
            if (!acc.diagonalRL[currDiagonalRLIndex]) acc.diagonalRL[currDiagonalRLIndex] = [];
            acc.diagonalLR[currDiagonalLRIndex][j] = c;
            acc.diagonalRL[currDiagonalRLIndex][j] = c;
        })
        return acc;
    }, {
        horizontal: [],
        vertical: [],
        diagonalLR: [],
        diagonalRL: []
    });


    return [
        ...strings.horizontal,
        ...strings.horizontal.map(s => [...s].reverse()),
        ...strings.vertical,
        ...strings.vertical.map(s => [...s].reverse()),
        ...strings.diagonalRL,
        ...strings.diagonalRL.map(s => [...s].reverse()),
        ...strings.diagonalLR,
        ...strings.diagonalLR.map(s => [...s].reverse())
    ]
}


const solvePart1 = (input) => {
    const allStrings = getAllStrings(input).filter(s => s);
    const toFile = []

    const res = allStrings.reduce((acc, curr) => {
        const currRes = countWordsInString(curr, 'XMAS')
        toFile.push(curr.join(''))
        return acc + currRes;
    }, 0);

    fs.writeFileSync('debug', toFile.join('\n'));

    return res;
}





const getDiagonals = (input) => {
    return input.reduce((acc, curr, i) => {
        curr.split('').forEach((c, j) => {
            const currDiagonalLRIndex = curr.length + i - j,
                currDiagonalRLIndex = curr.length - j - i + input.length - 1;

            if (!acc.diagonalLR[currDiagonalLRIndex]) acc.diagonalLR[currDiagonalLRIndex] = [];
            if (!acc.diagonalRL[currDiagonalRLIndex]) acc.diagonalRL[currDiagonalRLIndex] = [];
            acc.diagonalLR[currDiagonalLRIndex][j] = c;
            acc.diagonalRL[currDiagonalRLIndex][j] = c;

            if (c === 'A') acc.crossingPairs.push({
                LR: currDiagonalLRIndex,
                RL: currDiagonalRLIndex,
                crossPoint: j
            });
        })
        return acc;
    }, {
        diagonalLR: [],
        diagonalRL: [],
        crossingPairs: []
    });
}


const solvePart2 = (input) => {
    const { diagonalLR, diagonalRL, crossingPairs } = getDiagonals(input);
    const word = 'MAS', reversedWord = [...word].reverse().join('');

    return crossingPairs.reduce((acc, curr) => {

        if (curr.crossPoint - 1 < 0 || curr.crossPoint - 1 < 0 
            || curr.crossPoint + 1 >= diagonalLR[curr.LR].length
            || curr.crossPoint + 1 >= diagonalRL[curr.RL].length
        ) return acc;

       
        const diagonalLRWord = diagonalLR[curr.LR].slice(curr.crossPoint - 1, curr.crossPoint + 2).join(''),
            diagonalRLWord = diagonalRL[curr.RL].slice(curr.crossPoint - 1, curr.crossPoint + 2).join('');


        if ((diagonalLRWord === word || diagonalLRWord === reversedWord)
            && (diagonalRLWord === word || diagonalRLWord === reversedWord)) {
            acc++;
        }

        return acc;
    }, 0);
}

console.log(solvePart2(readAllStringsFromFile('./input.txt')));