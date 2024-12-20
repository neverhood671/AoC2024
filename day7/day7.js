const fs = require('fs');

function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

const getEquations = (input) => {
    return input.map(equation => {
        const [testStr, numbersStr] = equation.split(':');

        return ({
            test: parseInt(testStr),
            numbers: numbersStr.trim().split(' ').map(x => parseInt(x))
        })
    })
}

const isEquationCorrect = (equation) => {
    const { test, numbers } = equation;

    if (numbers.length === 2)
        return numbers[0] * numbers[1] === test || numbers[0] + numbers[1] === test;

    const lastNumber = numbers[numbers.length - 1];
    const newNumbers = numbers.slice(0, numbers.length - 1);

    const doesDivisionWork = ((test % lastNumber === 0) && isEquationCorrect({
        test: test / lastNumber,
        numbers: newNumbers,
    }));

    const doesSubtractionWork = ((test - lastNumber > 0) && isEquationCorrect({
        test: test - lastNumber,
        numbers: newNumbers,
    }));

    return doesDivisionWork || doesSubtractionWork;
}

const solvePart1 = (input) => {
    const equations = getEquations(input);

    return equations.reduce((acc, curr) => {
        const isCorrect = isEquationCorrect(curr);
        if (isCorrect) acc += curr.test;
        return acc;
    }, 0)
}


const isEquationCorrectV2 = (equation) => {
    const { test, numbers } = equation;

    if (numbers.length === 2)
        return numbers[0] * numbers[1] === test
            || numbers[0] + numbers[1] === test
            || `${numbers[0]}${numbers[1]}` === `${test}`;

    const lastNumber = numbers[numbers.length - 1];
    const newNumbers = numbers.slice(0, numbers.length - 1);

    const doesDivisionWork = ((test % lastNumber === 0) && isEquationCorrectV2({
        test: test / lastNumber,
        numbers: newNumbers,
    }));

    const doesSubtractionWork = ((test - lastNumber > 0) && isEquationCorrectV2({
        test: test - lastNumber,
        numbers: newNumbers,
    }));

    const testStr = `${test}`;
    const lastNumberStr = `${lastNumber}`;

    const doesConcatenationWork = testStr.endsWith(lastNumberStr) && isEquationCorrectV2({
        test: parseInt(testStr.slice(0, testStr.length - lastNumberStr.length)),
        numbers: newNumbers,
    });
    return doesDivisionWork || doesSubtractionWork || doesConcatenationWork;
}

const solvePart2 = (input) => {
    const equations = getEquations(input);

    return equations.reduce((acc, curr) => {
        const isCorrect = isEquationCorrectV2(curr);
        if (isCorrect) acc += curr.test;
        return acc;
    }, 0)
}

console.log(solvePart2(readAllStringsFromFile('./input.txt')));