const fs = require('fs');


function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

const getTrailHeads = (map) => {
    return map.reduce((acc, curr, i) => {
        for (let j = 0; j < curr.length; j++) {
            if (curr[j] === '0') acc.push([i, j]);
        }
        return acc;
    }, []);
}

const canGoRight = (x, y, map) => {
    return y + 1 < map[0].length && map[x][y + 1].height === map[x][y].height + 1;
}

const canGoDown = (x, y, map) => {
    return x + 1 < map.length && map[x + 1][y].height === map[x][y].height + 1;
}

const canGoLeft = (x, y, map) => {
    return y - 1 >= 0 && map[x][y - 1].height === map[x][y].height + 1;
}

const canGoUp = (x, y, map) => {
    return x - 1 >= 0 && map[x - 1][y].height === map[x][y].height + 1;
}


const getTrailHeadScore = (trailHead, input) => {
    const map = input.map(line => line.split('').map(l => ({ height: parseInt(l), isVisited: false })));
    let res = 0;
    const stack = [trailHead];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (map[x][y].height === 9 && !map[x][y].isVisited) {
            map[x][y].isVisited = true;
            res++;
            continue;
        }

        if (canGoRight(x, y, map)) stack.push([x, y + 1]);
        if (canGoDown(x, y, map)) stack.push([x + 1, y]);
        if (canGoLeft(x, y, map)) stack.push([x, y - 1]);
        if (canGoUp(x, y, map)) stack.push([x - 1, y]);        
    }

    return res;
}

const solvePart1 = (input) => {
    const trailHeads = getTrailHeads(input);

    return trailHeads.reduce((acc, curr) => acc + getTrailHeadScore(curr, input), 0);
}

const getTrailHeadScoreV2 = (trailHead, input) => {
    const map = input.map(line => line.split('').map(l => ({ height: parseInt(l), isVisited: false })));
    let res = 0;
    const stack = [trailHead];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (map[x][y].height === 9) {
            map[x][y].isVisited = true;
            res++;
            continue;
        }

        if (canGoRight(x, y, map)) stack.push([x, y + 1]);
        if (canGoDown(x, y, map)) stack.push([x + 1, y]);
        if (canGoLeft(x, y, map)) stack.push([x, y - 1]);
        if (canGoUp(x, y, map)) stack.push([x - 1, y]);        
    }

    return res;
}

const solvePart2 = (input) => {
    const trailHeads = getTrailHeads(input);

    return trailHeads.reduce((acc, curr) => acc + getTrailHeadScoreV2(curr, input), 0);
}


console.log(solvePart2(readAllStringsFromFile('./input.txt')));