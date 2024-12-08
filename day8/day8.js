const fs = require('fs');


function readAllStringsFromFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString('utf-8')
        .split('\n');
}




const getAllAntennasCoordinates = (map) => {
    const res = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] !== '.') res.push([i, j]);
        }
    }
    return res;
}

const doPointsLayInOneLine = (p1, p2, p3) => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x3, y3] = p3;

    return (x3 - x1) * (y2 - y1) === (y3 - y1) * (x2 - x1);
}

const getDistance = (p1, p2) => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;

    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const solvePart1 = (input) => {
    const map = input.map(s => s.split(''));
    const antennas = getAllAntennasCoordinates(map);

    const antiNodes = new Set();

    for (let i = 0; i < antennas.length-1; i++) {
        for (let j = i+1; j < antennas.length; j++) {
         
            const [x1, y1] = antennas[i];
            const [x2, y2] = antennas[j];

            if (map[x1][y1] !== map[x2][y2]) continue;
            
            for (let k = 0; k < map.length; k++) {
                for (let l = 0; l < map[0].length; l++) {
                   if (k === x1 && l === y1) continue;
                   if (k === x2 && l === y2) continue;
                   if (!doPointsLayInOneLine(antennas[i], antennas[j], [k, l])) continue;

                    const firstAntennaDistance = getDistance([k, l], antennas[i]);
                    const secondAntennaDistance = getDistance([k, l], antennas[j]);

                    if (firstAntennaDistance === 2* secondAntennaDistance || secondAntennaDistance === 2* firstAntennaDistance) {
                        antiNodes.add([k, l].join(','));
                    }

                }
            }

            
        }
    }

    return antiNodes.size;
}

const getSquareDistance = (p1, p2) => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;

    return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}


const solvePart2 = (input) => {
    const map = input.map(s => s.split(''));
    const antennas = getAllAntennasCoordinates(map);

    const antiNodes = new Set();

    for (let i = 0; i < antennas.length-1; i++) {
        for (let j = i+1; j < antennas.length; j++) {
         
            const [x1, y1] = antennas[i];
            const [x2, y2] = antennas[j];

            if (map[x1][y1] !== map[x2][y2]) continue;

            antiNodes.add([x1, y1].join(','));
            antiNodes.add([x2, y2].join(','));
            
            for (let k = 0; k < map.length; k++) {
                for (let l = 0; l < map[0].length; l++) {
                   if (!doPointsLayInOneLine(antennas[i], antennas[j], [k, l])) continue;

                    const antennasManhattanDistance = getSquareDistance(antennas[i], antennas[j]);
                    const firstAntennaManhattanDistance = getSquareDistance([k, l], antennas[i]);
     
                    if (firstAntennaManhattanDistance % antennasManhattanDistance === 0) {
                        antiNodes.add([k, l].join(','));
                    }
                }
            }
        }
    }

    return antiNodes.size;
}

console.log(solvePart2(readAllStringsFromFile('./input.txt')));
