const fs = require('fs');


function readInput(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split(' ');
}

const transformStone = (stone) => {
    if (Array.isArray(stone)) {
        return stone.map(transformStone);
    }
    if (stone === '0') return '1';

    if (stone.length % 2 === 0) {
        return [stone.slice(0, stone.length / 2), `${parseInt(stone.slice(stone.length / 2))}`];
    }

    return `${stone * 2024}`
}

const solvePart1 = (input) => {
    const blinks = 25;

    let i = 0;
    let depth = 0;
    let res = [...input]
    while (i < blinks) {
        res = res.map(stone => transformStone(stone, depth));
        i++;
    }

    return res.flat(blinks).length
}

console.log(solvePart1(readInput('./input.txt')));