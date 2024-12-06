const fs = require('fs');

const DEBUG = true;

function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

const getGuardPosition = (map) => {
    const guardSymbols = ['v', '^', '<', '>'];
    let guardStartPosition = {};

    for (let i = 0; i < map.length; i++) {
        const guardPosition = map[i].findIndex(cell => guardSymbols.includes(cell));
        if (guardPosition !== -1) {
            guardStartPosition = { point: [i, guardPosition], direction: map[i][guardPosition] };
            break;
        }
    }


    return guardStartPosition
}

const isGuardStillOnTheMap = (map, guardPosition) => {
    return guardPosition[0] >= 0 && guardPosition[0] < map.length && guardPosition[1] >= 0 && guardPosition[1] < map[0].length;
}

const rotate = (direction) => {
    switch (direction) {
        case '^':
            return '>';
        case 'v':
            return '<';
        case '<':
            return '^';
        case '>':
            return 'v';
    }
}

const move = (map, position, initialDirection) => {
    const [x, y] = position;
    const obstacle = '#';
    let direction = initialDirection;

    switch (direction) {
        case '^':
            if (isGuardStillOnTheMap(map, [x - 1, y]) && map[x - 1][y] === obstacle) {
                direction = rotate(direction);
                return move(map, position, direction);
            }
            return { position: [x - 1, y], direction };
        case 'v':
            if (isGuardStillOnTheMap(map, [x + 1, y]) && map[x + 1][y] === obstacle) {
                direction = rotate(direction);
                return move(map, position, direction);
            }
            return { position: [x + 1, y], direction };
        case '<':
            if (isGuardStillOnTheMap(map, [x, y - 1]) && map[x][y - 1] === obstacle) {
                direction = rotate(direction);
                return move(map, position, direction);
            }
            return { position: [x, y - 1], direction };
        case '>':
            if (isGuardStillOnTheMap(map, [x, y + 1]) && map[x][y + 1] === obstacle) {
                direction = rotate(direction);
                return move(map, position, direction);
            }
            return { position: [x, y + 1], direction };
    }
}

const calculateGuardRoute = (map, guardStartPosition, guardInitialDirection) => {
    let res = new Set();
    res.add(guardStartPosition.join(''));
    let guardPosition = guardStartPosition;
    let guardDirection = guardInitialDirection;

    do {
        const newState = move(map, guardPosition, guardDirection);
        guardPosition = [...newState.position];
        guardDirection = newState.direction;
        res.add(guardPosition.join(','));
        if (DEBUG && isGuardStillOnTheMap(map, guardPosition)) map[guardPosition[0]][guardPosition[1]] = guardDirection;
    } while (isGuardStillOnTheMap(map, guardPosition));

    return res.size - 1;
}


const solvePart1 = (input) => {
    const map = input.map(row => row.split(''));
    const { point: guardStartPosition, direction } = getGuardPosition(map);
    if (DEBUG) map[guardStartPosition[0]][guardStartPosition[1]] = 'S'

    const res = calculateGuardRoute(map, guardStartPosition, direction);

    if (DEBUG) fs.writeFileSync('debug', map.map(x => x.join('')).join('\n'));

    return res;
}

const isGuardRouteCyclic = (map, guardStartPosition, guardInitialDirection) => {
    let positions = new Set();
    positions.add(guardStartPosition.join(''));
    let guardPosition = guardStartPosition;
    let guardDirection = guardInitialDirection;

    do {
        const newState = move(map, guardPosition, guardDirection);
        guardPosition = [...newState.position];
        guardDirection = newState.direction;

        const positionHash = guardPosition.join(',') + guardDirection;
        if (positions.has(positionHash)) return true;
        positions.add(positionHash);
    } while (isGuardStillOnTheMap(map, guardPosition));

    return false
}


const solvePart2 = (input) => {
    const map = input.map(row => row.split(''));
    const { point: guardStartPosition, direction } = getGuardPosition(map);
    let res = 0;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (!(i === guardStartPosition[0] && j === guardStartPosition[1])) {
                if (map[i][j] === '#') continue;
                const oldValue = map[i][j];
                map[i][j] = '#';
                const isCyclic = isGuardRouteCyclic(map, guardStartPosition, direction);
                if (isCyclic) res++;
                map[i][j] = oldValue;
            }

            
        }
    }

    return res;
}
console.log(solvePart2(readAllStringsFromFile('input.txt')));