const fs = require('fs');


function readInput(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}

const obstacle = '#';
const box = 'O';
const emptySpot = '.';
const robot = '@';

const getRes = (map) => map.reduce((acc, curr, i) => {
    curr.forEach((c, j) => {
        if (c === 'O') acc += 100*i + j;
    })
    return acc;
}, 0)



const getRobotInitialPos = (map) => {
    for (let i = 0; i < map.length; i++) {
        const j = map[i].findIndex(c => c === robot);
        if (j > -1) return ([i, j])
    }
}

const isPossibleToMove = (initialPos, direction, map) => {
    const [x, y] = initialPos;
    if (direction === '^') {
        if (map[x - 1][y] === obstacle) return false;
        if (map[x - 1][y] === box) return isPossibleToMove([x - 1, y], direction, map)
        return true;   
    }

    if (direction === 'v') {
        if (map[x + 1][y] === obstacle) return false;
        if (map[x + 1][y] === box) return isPossibleToMove([x + 1, y], direction, map)
        return true; 
    }

    if (direction === '<') {
        if (map[x][y - 1] === obstacle) return false;
        if (map[x][y - 1] === box) return isPossibleToMove([x, y - 1], direction, map)
        return true; 
    }

    if (map[x][y + 1] === obstacle) return false;
    if (map[x][y + 1] === box) return isPossibleToMove([x, y + 1], direction, map)
    return true; 
}

const move = (robotPos, direction, map) => {
    const [x, y] = robotPos;
    let newRobotPos = [...robotPos]; 
    if (direction === '^') {
        if (map[x - 1][y] === emptySpot) {
            map[x - 1][y] = robot;
            newRobotPos = [x - 1, y];
            map[x][y] = emptySpot;
        } else if (map[x - 1][y] === box) {
            const currColumn = map.map(row => row[y]);
            const freeSpotIndex = currColumn.slice(0, x - 1).lastIndexOf(emptySpot);
            map[freeSpotIndex][y] = box;
            map[x - 1][y] = robot;
            newRobotPos = [x - 1, y];
            map[x][y] = emptySpot;
        }
    } else if (direction === 'v') {
        if (map[x + 1][y] === emptySpot) {
            map[x + 1][y] = robot;
            newRobotPos = [x + 1, y];
            map[x][y] = emptySpot;
        } else if (map[x + 1][y] === box) {
            const currColumn = map.map(row => row[y]);
            const freeSpotIndex = currColumn.slice(x + 1).indexOf(emptySpot);
            map[x + 1+freeSpotIndex][y] = box;
            map[x + 1][y] = robot;
            newRobotPos = [x + 1, y];
            map[x][y] = emptySpot;
        }
    } else if (direction === '<') {
        if (map[x][y - 1] === emptySpot) {
            map[x][y - 1] = robot;
            newRobotPos = [x, y - 1];
            map[x][y] = emptySpot;
        } else if (map[x][y - 1] === box) {
            const freeSpotIndex = map[x].slice(0, y - 1).lastIndexOf(emptySpot);
            map[x][freeSpotIndex] = box;
            map[x][y - 1] = robot;
            newRobotPos = [x, y - 1];
            map[x][y] = emptySpot;
        }
    } else {
        console.log('lalal', map[x][y + 1])
        if (map[x][y + 1] === emptySpot) {
            map[x][y + 1] = robot;
            newRobotPos = [x, y + 1];
            map[x][y] = emptySpot;
        } else if (map[x][y + 1] === box) {
            const freeSpotIndex = map[x].slice(y + 1).indexOf(emptySpot);
            console.log('here!!!!!', freeSpotIndex)
            map[x][y + 1 + freeSpotIndex] = box;
            map[x][y + 1] = robot;
            newRobotPos = [x, y + 1];
            map[x][y] = emptySpot;
        }
    }
    return newRobotPos;

}

const doMovements = (robotPos, map, movements) => {
    let newRobotPos = robotPos;
    while (movements.length > 0) {
        let direction = movements.pop();
        const isMoving = isPossibleToMove(newRobotPos, direction, map);   
        newRobotPos = isMoving ? move(newRobotPos, direction, map) : newRobotPos;
        // console.log('Move:', direction, isMoving, newRobotPos)
        // console.log(map.map(row => row.join('')).join('\n'))
        // console.log('-----------------------------')
    }
}

const solvePart1 = (input) => {
    const emptyRow = '', emptyRowIndex = input.findIndex(row => row === emptyRow);
    const map = input.slice(0, emptyRowIndex).map(row => row.split(''))
    const movements = input.slice(emptyRowIndex + 1).join('').split('')
    let robotPos = getRobotInitialPos(map);


    doMovements(robotPos, map, movements.reverse());

    return getRes(map)
}


console.log(solvePart1(readInput('./input.txt')))