const fs = require('fs');

function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

function getLists() {
    return input.reduce((acc, curr) => {
        const [number1, number2] = curr.split('   ').map(Number);
        acc[0].push(number1);
        acc[1].push(number2);
        return acc;
    }, [[], []])
}

function solvePart1(input) {
    const [list1, list2] = getLists(input);
    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    return list1.reduce((acc, curr, i) => {
        return acc + Math.abs(curr - list2[i]);
    }, 0);
}

function solvePart2(input) {
    const [list1, list2] = getLists(input);
    return list1.reduce((acc, curr) => {
        return acc + list2.filter(x => x === curr).length * curr;
    }, 0);
}

console.log(solvePart2(readAllStringsFromFile('./input.txt')));