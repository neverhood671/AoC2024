const fs = require('fs');

function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

const getRulesAndUpdates = (input) => {
    let rules = [], updates = [], i = 0;
    while (input[i] !== '') {
        rules.push(input[i]);
        i++;
    }

    i++;

    while (i < input.length) {
        updates.push(input[i]);
        i++;
    }

    return [
        rules.map(rule => rule.split('|')),
        updates.map(update => update.split(','))
    ];
}

const getRulesMap = (rawRules) => {
    const firstRule = rawRules.pop();
    let rulesMap = {}

    rawRules.forEach(rule => {
        const [left, right] = rule;
        if (!rulesMap[left]) rulesMap[left] = [];
        rulesMap[left].push(right);
    });
    return rulesMap;
}

const isUpdateCorrect = (update, rulesMap) => {
    for (let i = update.length - 1; i > 0; i--) {
        if (!rulesMap[update[i]]) continue;

        const numbersBefore = update.slice(0, i);
        const numbersMustBeAfter = rulesMap[update[i]];

        const isCurrentNumberFine = !numbersMustBeAfter.some(number => numbersBefore.includes(number));
        if (!isCurrentNumberFine) return false;
    }

    return true;
}

const solvePart1 = (input) => {
    const [rules, updates] = getRulesAndUpdates(input);

    const rulesMap = getRulesMap([...rules]);
    const correctUpdates = updates.filter(update => isUpdateCorrect(update, rulesMap));

    return correctUpdates.reduce((acc, curr) => acc + parseInt(curr[Math.ceil(curr.length / 2) - 1]), 0);
}

const swipeNumbers = (from, to, arr) => {
    const temp = arr[from];
    arr[from] = arr[to];
    arr[to] = temp;
    return arr;
}

const fixUpdate = (update, rulesMap) => {
    for (let i = update.length - 1; i >= 0; i--) {
        if (!rulesMap[update[i]]) continue;

        const numbersBefore = update.slice(0, i);
        const numbersMustBeAfter = rulesMap[update[i]];

        const incorrectNumberIndex = numbersBefore.findIndex(number => numbersMustBeAfter.includes(number));
        if (incorrectNumberIndex === -1) continue;

        update = fixUpdate(swipeNumbers(incorrectNumberIndex, i, update), rulesMap);
    }

    return update;
}

const solvePart2 = (input) => {
    const [rules, updates] = getRulesAndUpdates(input);

    const rulesMap = getRulesMap([...rules]);
    const incorrectUpdates = updates.filter(update => !isUpdateCorrect(update, rulesMap));
    console.log(incorrectUpdates)

    return incorrectUpdates.reduce((acc, curr) => {
        const correctedUpdate = fixUpdate(curr, rulesMap);
        return acc + parseInt(correctedUpdate[Math.ceil(curr.length / 2) - 1])
    }, 0);
}



console.log(solvePart2(readAllStringsFromFile('./input.txt')))